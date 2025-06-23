import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import {
  PhotoIcon,
  UserPlusIcon,
  BookOpenIcon,
  UserGroupIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
  ChevronDownIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import MemoryCard from "../components/MemoryCard";
import { useAuth } from "../contexts/AuthContext";
import { useLenis } from "lenis/react";
import MemoryTimeline from "../components/MemoryTimeline ";
function VaultDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const [vault, setVault] = useState(null);
  const [memories, setMemories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [uploadData, setUploadData] = useState({
    title: "",
    description: "",
    media: null,
  });
  const [inviteEmail, setInviteEmail] = useState("");
  const [uploading, setUploading] = useState(false);
  const [inviting, setInviting] = useState(false);
  const [activeTab, setActiveTab] = useState("all"); // 'all', 'pending', 'approved'
  const [showMembers, setShowMembers] = useState(false);
  const [refiningdescriptionloading, setRefiningDescriptionLoading] =
    useState(false);
  const lenis = useLenis();
  const [View, setView] = useState("memories");
  useEffect(() => {
    const fetchVaultData = async () => {
      try {
        const [vaultRes, memoriesRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/vaults/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
          axios.get(
            `${import.meta.env.VITE_BACKEND_URL}/api/memories/vault/${id}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          ),
        ]);
        console.log("Vault Data:", vaultRes.data.vault);
        console.log("Vault Members Raw Data:", vaultRes.data.vault.members);
        vaultRes.data.vault.members.forEach((member) => {
          console.log("Member Data:", {
            name: member.user.name,
            email: member.user.email,
            profilePic: member.user.profilePic,
          });
        });

        setVault(vaultRes.data.vault);
        setMemories(memoriesRes.data.memories);
      } catch (err) {
        toast.error(err.response?.data?.error || "Failed to load vault data");
        navigate("/dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchVaultData();
  }, [id, navigate, token]);

  useEffect(() => {
    if (!lenis) return;

    if (uploadModalOpen) {
      lenis.stop();
    } else {
      lenis.start();
    }
  }, [uploadModalOpen]);

  const handleUpload = async (e) => {
    e.preventDefault();
    setUploading(true);
    console.log("hrllo");

    const formData = new FormData();
    formData.append("title", uploadData.title);
    formData.append("description", uploadData.description);
    formData.append("media", uploadData.media);
    formData.append("vaultId", id);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/memories`,
        formData
      );
      setMemories([...memories, response.data.memory]);
      setUploadModalOpen(false);
      setUploadData({ title: "", description: "", media: null });
      toast.success("Memory uploaded successfully");
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to upload memory");
    } finally {
      setUploading(false);
    }
  };

  const handleInvite = async (e) => {
    e.preventDefault();
    setInviting(true);

    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/vaults/add-member`,
        {
          vaultId: id,
          email: inviteEmail,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Refresh vault data to get updated members list
      const vaultRes = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/vaults/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setVault(vaultRes.data.vault);

      setInviteModalOpen(false);
      setInviteEmail("");
      toast.success("Member invited successfully");
    } catch (error) {
      console.error("Invite error:", error.response?.data);
      toast.error(error.response?.data?.error || "Failed to send invitation");
    } finally {
      setInviting(false);
    }
  };

  const handleMemoryAction = async (memoryId, action) => {
    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/memories/${memoryId}/${action}`
      );
      const updatedMemories = memories.map((memory) =>
        memory._id === memoryId
          ? { ...memory, status: action === "approve" ? "approved" : "pending" }
          : memory
      );
      setMemories(updatedMemories);
      toast.success(
        `Memory ${action === "approve" ? "approved" : "pending review"}`
      );
    } catch (error) {
      toast.error(error.response?.data?.error || `Failed to ${action} memory`);
    }
  };

  const handleDeleteMemory = async (memoryId) => {
    try {
      if (
        !window.confirm(
          "Are you sure you want to request deletion of this memory? This will initiate a voting process with all vault members."
        )
      ) {
        return;
      }

      const response = await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/memories/${memoryId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success(
        "Deletion vote initiated successfully. All vault members will be notified to vote."
      );
      navigate(`/vote/${response.data.voteId}`);
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Failed to initiate deletion vote";
      toast.error(errorMessage);
      console.error("Error initiating deletion vote:", error);
    }
  };

  const filteredMemories = memories.filter((memory) => {
    if (activeTab === "all") return true;
    return memory.status === activeTab;
  });

  const stats = {
    total: memories.length,
    pending: memories.filter((m) => m.status === "pending").length,
    approved: memories.filter((m) => m.status === "approved").length,
  };

  const isAdmin = vault?.members?.some((member) => {
    console.log("Checking member:", member);
    console.log("User ID:", user?._id);
    console.log("Member User ID:", member.user._id);
    console.log("Is Match?", member.user._id === user?._id);
    console.log("Is Admin?", member.role === "admin");
    return member.user._id === user?._id && member.role === "admin";
  });

  console.log("Final isAdmin value:", isAdmin);

  const TEXT_API =
    "https://api-hub-backend.onrender.com/api/v1/auth/testforopenai";

  const generateDescription = async (prompt) => {
    try {
      const response = await axios.post(TEXT_API, {
        mess: `Generate a concise, engaging description for an image based on: "${prompt}"`,
      });
      return (
        response.data?.message || `AI-generated image based on: "${prompt}"`
      );
    } catch (error) {
      console.error("Failed to generate description:", error);
      return `AI-generated image based on: "${prompt}"`;
    }
  };

  return (
    <div className="container px-4 py-4 sm:py-8 mx-auto">
      {loading ? (
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="w-12 h-12 border-t-2 border-b-2 rounded-full animate-spin border-vintage-600"></div>
        </div>
      ) : vault ? (
        <>
          {/* Vault Header */}
          <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
              <h1 className="vintage-title text-2xl sm:text-3xl break-words">
                {vault.name}
              </h1>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => setUploadModalOpen(true)}
                  className="btn-primary flex items-center space-x-2 text-sm sm:text-base"
                >
                  <PhotoIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                  <span>Upload Memory</span>
                </button>
                {isAdmin && (
                  <button
                    onClick={() => setInviteModalOpen(true)}
                    className="btn-secondary flex items-center space-x-2 text-sm sm:text-base"
                  >
                    <UserPlusIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                    <span>Invite Member</span>
                  </button>
                )}
              </div>
            </div>

            <p className="text-vintage-600 text-sm sm:text-base mb-6 break-words">
              {vault.description}
            </p>

            {/* Vault Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-vintage-50 rounded-lg p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <BookOpenIcon className="h-5 w-5 sm:h-6 sm:w-6 text-vintage-600" />
                </div>
                <div className="text-xl sm:text-2xl font-semibold text-vintage-900 mb-1">
                  {stats.total}
                </div>
                <div className="text-sm text-vintage-600">Total Memories</div>
              </div>
              <div className="bg-vintage-50 rounded-lg p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <ClockIcon className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-500" />
                </div>
                <div className="text-xl sm:text-2xl font-semibold text-vintage-900 mb-1">
                  {stats.pending}
                </div>
                <div className="text-sm text-vintage-600">Pending Approval</div>
              </div>
              <div className="bg-vintage-50 rounded-lg p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <CheckCircleIcon className="h-5 w-5 sm:h-6 sm:w-6 text-green-500" />
                </div>
                <div className="text-xl sm:text-2xl font-semibold text-vintage-900 mb-1">
                  {stats.approved}
                </div>
                <div className="text-sm text-vintage-600">
                  Approved Memories
                </div>
              </div>
            </div>

            {/* Members Section */}
            <div className="mt-6">
              <button
                onClick={() => setShowMembers(!showMembers)}
                className="flex items-center space-x-2 text-vintage-600 hover:text-vintage-800"
              >
                <UserGroupIcon className="h-5 w-5" />
                <span>Members ({vault.members.length})</span>
                <ChevronDownIcon
                  className={`h-4 w-4 transform transition-transform ${
                    showMembers ? "rotate-180" : ""
                  }`}
                />
              </button>
              {showMembers && (
                <div className="mt-4 space-y-2">
                  {vault.members.map((member) => (
                    <div
                      key={member.user._id}
                      className="flex items-center justify-between p-3 bg-vintage-50 rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        {member.user.profilePic ? (
                          <img
                            src={member.user.profilePic}
                            alt={member.user.name}
                            className="w-10 h-10 rounded-full object-cover border-2 border-vintage-200"
                            onError={(e) => {
                              console.log(
                                "Profile pic load error for:",
                                member.user.name
                              );
                              e.target.onerror = null;
                              e.target.src = null;
                              e.target.parentElement.innerHTML = `<div class="w-10 h-10 rounded-full bg-vintage-100 flex items-center justify-center border-2 border-vintage-200"><svg class="w-6 h-6 text-vintage-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg></div>`;
                            }}
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-vintage-100 flex items-center justify-center border-2 border-vintage-200">
                            <UserCircleIcon className="w-6 h-6 text-vintage-400" />
                          </div>
                        )}
                        <div className="flex flex-col">
                          <div className="text-sm sm:text-base font-medium">
                            {member.user.name}
                          </div>
                          <div className="text-xs text-vintage-600">
                            {member.user.email}
                          </div>
                        </div>
                        {member.role === "admin" && (
                          <span className="ml-2 px-2 py-1 text-xs bg-vintage-200 text-vintage-800 rounded-full">
                            Admin
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <nav className="flex justify-center space-x-3 mb-6">
            <button
              onClick={() => setView("memories")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
                View === "memories"
                  ? "bg-vintage-600 text-white shadow"
                  : "bg-vintage-100 text-vintage-700 hover:bg-vintage-200"
              }`}
            >
              Memories
            </button>

            <button
              onClick={() => setView("timeline")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
                View === "timeline"
                  ? "bg-vintage-600 text-white shadow"
                  : "bg-vintage-100 text-vintage-700 hover:bg-vintage-200"
              }`}
            >
              Timeline
            </button>
          </nav>

          {/* Memories Section */}

          {View === "memories" ? (
            <div className="bg-white rounded-xl shadow-md p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <h2 className="vintage-title text-xl sm:text-2xl">Memories</h2>
                <div className="flex gap-2">
                  <button
                    onClick={() => setActiveTab("all")}
                    className={`px-3 py-1 rounded-full text-sm ${
                      activeTab === "all"
                        ? "bg-vintage-600 text-white"
                        : "bg-vintage-100 text-vintage-600"
                    }`}
                  >
                    All
                  </button>
                  <button
                    onClick={() => setActiveTab("pending")}
                    className={`px-3 py-1 rounded-full text-sm ${
                      activeTab === "pending"
                        ? "bg-yellow-500 text-white"
                        : "bg-vintage-100 text-vintage-600"
                    }`}
                  >
                    Pending
                  </button>
                  <button
                    onClick={() => setActiveTab("approved")}
                    className={`px-3 py-1 rounded-full text-sm ${
                      activeTab === "approved"
                        ? "bg-green-600 text-white"
                        : "bg-vintage-100 text-vintage-600"
                    }`}
                  >
                    Approved
                  </button>
                </div>
              </div>

              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="w-12 h-12 border-t-2 border-b-2 rounded-full animate-spin border-vintage-600"></div>
                </div>
              ) : filteredMemories.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-vintage-600">
                    {activeTab === "all"
                      ? "No memories available."
                      : `No ${activeTab} memories available.`}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {filteredMemories.map((memory) => (
                    <MemoryCard
                      key={memory._id}
                      memory={memory}
                      isAdmin={isAdmin}
                      onAction={handleMemoryAction}
                      onDelete={handleDeleteMemory}
                    />
                  ))}
                </div>
              )}
            </div>
          ) : (
            <MemoryTimeline memories={memories} />
          )}

          {/* Upload Modal */}
          {uploadModalOpen && (
            <div className="fixed inset-0  bg-black/50 backdrop-blur-sm flex  justify-center p-4 z-50 overflow-y-auto">
              {/* Main container - changes layout at lg breakpoint (1024px) */}
              <div className="bg-white rounded-xl shadow-xl border border-vintage-200 w-full max-w-4xl mx-2 sm:mx-0 max-h-[100vh] sm:max-h-[100vh] flex flex-col lg:flex-row lg:min-h-[450px]">
                {/* Left side - form content (stays same on mobile) */}
                <div className="flex-1 p-4 sm:p-6 flex flex-col overflow-hidden">
                  {/* Header with close button */}
                  <div className="flex justify-between items-center mb-3 sm:mb-4">
                    <h2 className="vintage-title text-lg sm:text-xl md:text-2xl">
                      Upload a Memory
                    </h2>
                    <button
                      onClick={() => setUploadModalOpen(false)}
                      className="text-vintage-700 hover:text-vintage-900 transition-colors p-1"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 sm:h-6 sm:w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>

                  {/* Scrollable form content */}
                  <div className="flex-1 overflow-y-auto pr-1 sm:pr-2 -mr-1 sm:-mr-2">
                    <form
                      onSubmit={handleUpload}
                      className="space-y-3 sm:space-y-4"
                    >
                      {/* Form fields remain the same */}
                      <div>
                        <label className="block text-sm sm:text-base font-medium text-vintage-800 mb-1">
                          Title*
                        </label>
                        <input
                          type="text"
                          value={uploadData.title}
                          onChange={(e) =>
                            setUploadData({
                              ...uploadData,
                              title: e.target.value,
                            })
                          }
                          className="input-field w-full text-sm sm:text-base border border-vintage-300 focus:border-vintage-500 focus:ring-1 focus:ring-vintage-200 rounded px-3 py-2"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm sm:text-base font-medium text-vintage-800 mb-1">
                          Description
                        </label>
                        <textarea
                          value={uploadData.description}
                          onChange={(e) =>
                            setUploadData({
                              ...uploadData,
                              description: e.target.value,
                            })
                          }
                          className="input-field w-full text-sm sm:text-base border border-vintage-300 focus:border-vintage-500 focus:ring-1 focus:ring-vintage-200 rounded px-3 py-2"
                          rows={3}
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setRefiningDescriptionLoading(true);
                            const getdata = async () => {
                              const data = await generateDescription(
                                uploadData.description
                              );
                              setUploadData({
                                ...uploadData,
                                description: data,
                              });
                            };
                            getdata();
                            setRefiningDescriptionLoading(false);
                          }}
                          className={`mt-2 w-full flex items-center justify-center gap-1.5 sm:gap-2 text-xs sm:text-[0.8125rem] leading-4 px-2.5 sm:px-3 py-1.5 sm:py-[0.4rem] bg-vintage-50 hover:bg-vintage-100/80 active:bg-vintage-100 text-vintage-700 border border-vintage-200/80 rounded-md transition-all duration-150 ease-in-out disabled:opacity-60 disabled:cursor-not-allowed ${
                            refiningdescriptionloading
                              ? "animate-pulse cursor-wait"
                              : ""
                          }`}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-3 w-3 sm:h-4 sm:w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M13 10V3L4 14h7v7l9-11h-7z"
                            />
                          </svg>
                          Refine Description with AI
                        </button>
                      </div>

                      <div>
                        <label className="block text-sm sm:text-base font-medium text-vintage-800 mb-1">
                          Media*
                        </label>
                        <input
                          type="file"
                          accept="image/*,video/*,audio/*"
                          onChange={(e) =>
                            setUploadData({
                              ...uploadData,
                              media: e.target.files[0],
                            })
                          }
                          className="input-field w-full text-xs sm:text-sm file:text-xs sm:file:text-sm file:mr-2 file:py-1 file:px-2 sm:file:px-3 file:border-0 file:font-medium file:bg-vintage-100 file:text-vintage-700 hover:file:bg-vintage-200 rounded border border-vintage-300"
                          required
                        />
                      </div>

                      {/* Buttons moved to right panel on desktop */}
                      <div className="lg:hidden flex justify-end gap-2 sm:gap-3 pt-3 sm:pt-4 border-t border-vintage-100">
                        <button
                          type="button"
                          onClick={() => setUploadModalOpen(false)}
                          className="btn-secondary text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2 border border-vintage-300 text-vintage-700 hover:bg-vintage-50 transition-colors rounded"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={uploading}
                          className="btn-primary text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2 bg-vintage-600 hover:bg-vintage-700 text-white disabled:bg-vintage-400 transition-colors flex items-center justify-center min-w-[80px] sm:min-w-[100px] rounded"
                        >
                          {uploading ? (
                            <>
                              <svg
                                className="animate-spin -ml-1 mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4 text-white"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                              >
                                <circle
                                  className="opacity-25"
                                  cx="12"
                                  cy="12"
                                  r="10"
                                  stroke="currentColor"
                                  strokeWidth="4"
                                ></circle>
                                <path
                                  className="opacity-75"
                                  fill="currentColor"
                                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                ></path>
                              </svg>
                              Uploading...
                            </>
                          ) : (
                            "Upload"
                          )}
                        </button>
                      </div>
                    </form>
                  </div>

                  {/* Additional CTA - hidden on desktop */}
                  <div className="lg:hidden mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-vintage-100 text-center">
                    <p className="text-xs sm:text-sm text-vintage-600 mb-1 sm:mb-2">
                      Don't have content ready?
                    </p>
                    <button
                      onClick={() => {
                        navigate("/legacybot", {
                          state: { generateNew: true },
                        });
                        setUploadModalOpen(false);
                      }}
                      className="text-xs sm:text-sm font-medium text-vintage-700 hover:text-vintage-900 flex items-center justify-center gap-1 w-full py-1.5 sm:py-2 hover:bg-vintage-50 rounded-md transition-colors"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 sm:h-5 sm:w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                        />
                      </svg>
                      Generate with AI
                    </button>
                  </div>
                </div>

                {/* Right side panel - only visible on desktop */}
                <div className="hidden lg:flex flex-col w-[280px] border-l border-vintage-200 bg-vintage-50/50 p-4 sm:p-6">
                  <div className="space-y-4">
                    {/* Action buttons */}
                    <div className="flex flex-col gap-3">
                      <button
                        type="submit"
                        disabled={uploading}
                        className="btn-primary w-full text-sm px-4 py-2.5 bg-vintage-600 hover:bg-vintage-700 text-white disabled:bg-vintage-400 transition-colors flex items-center justify-center rounded"
                      >
                        {uploading ? (
                          <>
                            <svg
                              className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              ></circle>
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              ></path>
                            </svg>
                            Uploading...
                          </>
                        ) : (
                          "Upload Memory"
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => setUploadModalOpen(false)}
                        className="btn-secondary w-full text-sm px-4 py-2.5 border border-vintage-300 text-vintage-700 hover:bg-vintage-50 transition-colors rounded"
                      >
                        Cancel
                      </button>
                    </div>

                    {/* Divider */}
                    <div className="border-t border-vintage-200 my-2"></div>

                    {/* Additional CTA */}
                    <div className="text-center">
                      <p className="text-sm text-vintage-600 mb-2">
                        Don't have content ready?
                      </p>
                      <button
                        onClick={() => {
                          navigate("/legacybot", {
                            state: { generateNew: true },
                          });
                          setUploadModalOpen(false);
                        }}
                        className="text-sm font-medium text-vintage-700 hover:text-vintage-900 flex items-center justify-center gap-2 w-full py-2 hover:bg-vintage-100 rounded-md transition-colors"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                          />
                        </svg>
                        Generate with AI
                      </button>
                    </div>

                    {/* Preview section (optional) */}
                    {uploadData.media && (
                      <div className="mt-4 pt-4 border-t border-vintage-200">
                        <h3 className="text-sm font-medium text-vintage-800 mb-2">
                          Preview
                        </h3>
                        {/* Add your media preview component here */}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
          {/* Invite Modal */}
          {inviteModalOpen && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-xl p-4 sm:p-6 w-full max-w-md">
                <h2 className="vintage-title text-xl sm:text-2xl mb-4">
                  Invite Member
                </h2>
                <form onSubmit={handleInvite} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-vintage-800 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                      className="input-field text-sm sm:text-base"
                      required
                    />
                  </div>
                  <div className="flex justify-end gap-3 mt-6">
                    <button
                      type="button"
                      onClick={() => setInviteModalOpen(false)}
                      className="btn-secondary text-sm sm:text-base"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={inviting}
                      className="btn-primary text-sm sm:text-base"
                    >
                      {inviting ? "Inviting..." : "Send Invite"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </>
      ) : null}
    </div>
  );
}

export default VaultDetail;
