import React, { useEffect, useState } from "react";
import styles from "./styles.module.css";
import UserLayout from "@/layout/UserLayout";
import DashboardLayout from "@/layout/DashboardLayout";
import { useDispatch, useSelector } from "react-redux";
import { getAboutUser } from "@/config/redux/action/authAction";
import { BASE_URL, clientServer } from "@/config";
import { deletePost, getAllPosts } from "@/config/redux/action/postAction";
import { useRouter } from "next/router";
const index = () => {
  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth);
  const postReducer = useSelector((state) => state.postReducer);
  const router = useRouter();
  const [userProfile, setUserProfile] = useState([]);
  const [userPosts, setUserPosts] = useState([]);
  const [isEditName, setIsEditName] = useState(false);
  const [isEditBio, setIsEditBio] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEduModalOpen, setIsEduModalOpen] = useState(false);
  const [inputData, setInputData] = useState({
    company: "",
    position: "",
    years: "",
  });
  const [inputEduData, setInputEduData] = useState({
    school: "",
    degree: "",
    fieldOfStudy: "",
  });
  const handleWorkInputChange = (e) => {
    const { name, value } = e.target;
    setInputData({ ...inputData, [name]: value });
  };
  const handleEduInputChange = (e) => {
    const { name, value } = e.target;
    setInputEduData({ ...inputEduData, [name]: value });
  };
  useEffect(() => {
    dispatch(getAboutUser({ token: localStorage.getItem("token") }));
    dispatch(getAllPosts());
  }, []);

  useEffect(() => {
    if (authState.user != undefined) {
      setUserProfile(authState.user);
      console.log(userProfile);
      let post = postReducer.posts.filter((post) => {
        return post.userId.username === authState.user.userId.username;
      });
      setUserPosts(post);
    }
    console.log(userPosts);
  }, [authState.user, postReducer.posts]);

  const updateProfilePicture = async (file) => {
    const formdata = new FormData();
    formdata.append("profile_picture", file);
    formdata.append("token", localStorage.getItem("token"));
    const response = await clientServer.post(
      "/upload_profile_picture",
      formdata,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    dispatch(getAboutUser({ token: localStorage.getItem("token") }));
  };

  const updateProfileData = async (updatedData = userProfile) => {
    const request = await clientServer.post("/user_update", {
      token: localStorage.getItem("token"),
      name: updatedData.userId.name,
    });

    const response = await clientServer.post("/update_profile_data", {
      token: localStorage.getItem("token"),
      bio: updatedData.bio,
      currentWork: updatedData.currentWork,
      pastWork: updatedData.pastWork,
      education: updatedData.education,
    });

    dispatch(getAboutUser({ token: localStorage.getItem("token") }));
  };

  return (
    <UserLayout>
      <DashboardLayout>
        {authState.user && userProfile.userId && (
          <div className={styles.container}>
            <div className={styles.backDropContainer}>
              <div className={styles.backDrop}>
                <label
                  htmlFor="profilePictureUpload"
                  className={styles.backDrop_overlay}
                >
                  <p>Edit</p>
                </label>
                <input
                  onChange={(e) => {
                    updateProfilePicture(e.target.files[0]);
                  }}
                  hidden
                  type="file"
                  id="profilePictureUpload"
                />
                <img
                  src={`${BASE_URL}/${userProfile.userId.profilePicture}`}
                  alt=""
                />
              </div>
            </div>
            <div className={styles.profileContainer_details}>
              <div
                style={{
                  display: "flex",
                  gap: "0.7rem",
                  flexDirection: "column",
                }}
              >
                <div style={{ flex: "0.8" }}>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      width: "fit-content",
                    }}
                  >
                    <div>
                      {isEditName ? (
                        <div
                          style={{
                            display: "flex",
                            width: "fit-content",
                            alignItems: "center",
                            gap: "1.2rem",
                            justifyContent: "center",
                          }}
                        >
                          <input
                            className={styles.nameEdit}
                            type="text"
                            value={userProfile.userId.name}
                            onChange={(e) =>
                              setUserProfile({
                                ...userProfile,
                                userId: {
                                  ...userProfile.userId,
                                  name: e.target.value,
                                },
                              })
                            }
                          />
                          {userProfile.userId.name !=
                            authState.user.userId.name && (
                            <div
                              onClick={() => {
                                updateProfileData();
                                setIsEditName(false);
                              }}
                              className={styles.updateButton}
                            >
                              Save
                            </div>
                          )}
                        </div>
                      ) : (
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            fontFamily: "Poppins !important",
                            gap: "1.2rem",
                          }}
                        >
                          <div
                            style={{
                              fontSize: "2.0rem",
                              fontWeight: "bold",
                              width: "auto",
                            }}
                          >
                            {userProfile.userId.name}
                          </div>
                          <div>
                            <svg
                              onClick={() => {
                                setIsEditName(true);
                              }}
                              style={{
                                color: "black",
                                width: "1.2rem",
                                height: "1.2rem",
                                cursor: "pointer",
                              }}
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={1.5}
                              stroke="currentColor"
                              className="size-6"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                              />
                            </svg>
                          </div>
                        </div>
                      )}
                    </div>
                    <p style={{ color: "grey" }}>
                      @{userProfile.userId.username}
                    </p>
                  </div>

                  <div>
                    {isEditBio ? (
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "1.2rem",
                        }}
                      >
                        <textarea
                          name=""
                          id=""
                          value={userProfile.bio}
                          placeholder={
                            userProfile.bio ? "" : "Write your bio here!"
                          }
                          onChange={(e) => {
                            setUserProfile({
                              ...userProfile,
                              bio: e.target.value,
                            });
                          }}
                          style={{ width: "100%", flex: "0.8" }}
                          rows={Math.max(
                            2,
                            Math.ceil(userProfile.bio.length / 40)
                          )}
                          cols={10}
                        ></textarea>
                        {userProfile.bio != authState.user.bio && (
                          <div style={{ flex: "0.2" }}>
                            <div
                              onClick={() => {
                                updateProfileData();
                                setIsEditBio(false);
                              }}
                              className={styles.updateButton}
                            >
                              Save
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          fontFamily: "Poppins !important",
                          gap: "1.2rem",
                        }}
                      >
                        <div
                          style={{
                            fontSize: "1rem",
                            fontWeight: "bold",
                            width: "auto",
                          }}
                        >
                          {userProfile.bio ? userProfile.bio : "Enter your bio"}
                        </div>
                        <div>
                          <svg
                            onClick={() => {
                              setIsEditBio(true);
                            }}
                            style={{
                              color: "black",
                              width: "1.2rem",
                              height: "1.2rem",
                              cursor: "pointer",
                            }}
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="size-6"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                            />
                          </svg>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div style={{ flex: "0.2" }}>
                  <h3 style={{ textAlign: "center" }}>Posts</h3>

                  {userPosts.length === 0 ? (
                    <p style={{ textAlign: "center", color: "gray" }}>
                      No posts available
                    </p>
                  ) : (
                    userPosts.map((post) => {
                      console.log(userPosts);
                      const formattedDate = new Date(
                        post.createdAt
                      ).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                      });
                      return (
                        <div key={post._id} className={styles.postCard}>
                          <div className={styles.card}>
                            {/* Header */}
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                              }}
                            >
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "0.5rem",
                                }}
                              >
                                <img
                                  src={`${BASE_URL}/${userProfile.userId.profilePicture}`}
                                  alt="User"
                                  style={{
                                    width: "32px",
                                    height: "32px",
                                    borderRadius: "50%",
                                    objectFit: "cover",
                                  }}
                                />
                                <div>
                                  <strong>{userProfile.userId.name}</strong>
                                  <div
                                    style={{
                                      fontSize: "0.8rem",
                                      color: "gray",
                                    }}
                                  >
                                    {userProfile.userId.username}
                                  </div>
                                </div>
                              </div>
                              <div
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  justifyContent: "center",
                                  alignItems: "center",
                                }}
                              >
                                <div
                                  style={{ fontSize: "0.8rem", color: "gray" }}
                                >
                                  {formattedDate}
                                </div>
                                {post.userId._id == userProfile.userId._id && (
                                  <div
                                    onClick={async () => {
                                      await dispatch(
                                        deletePost({ post_id: post._id })
                                      );
                                      await dispatch(getAllPosts());
                                    }}
                                    style={{ cursor: "pointer" }}
                                  >
                                    <svg
                                      style={{ height: "1.2em", color: "red" }}
                                      xmlns="http://www.w3.org/2000/svg"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      strokeWidth={1.5}
                                      stroke="currentColor"
                                      className="size-6"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                                      />
                                    </svg>
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Body */}
                            <p style={{ marginTop: "0.5rem" }}>{post.body}</p>

                            {/* Post Image */}
                            {post.media && (
                              <img
                                src={`${BASE_URL}/${post.media}`}
                                alt="Post"
                                style={{
                                  width: "100%",
                                  marginTop: "0.5rem",
                                  borderRadius: "0.5rem",
                                }}
                              />
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>

            <div className={styles.profileSection}>
              {/* Work History */}
              <section className={styles.sectionCard}>
                <div className={styles.sectionHeader}>
                  <h2 className={styles.sectionTitle}>💼 Work History</h2>
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className={styles.addButton}
                  >
                    ➕ Add Work
                  </button>
                </div>
                <div className={styles.cardGrid}>
                  {userProfile.pastWork.map((work, index) => (
                    <div key={index} className={styles.infoCard}>
                      <h3>
                        {work.company} - <span>{work.position}</span>
                      </h3>
                      <p>🕒 {work.years} years</p>
                    </div>
                  ))}
                </div>
              </section>

              {/* Education History */}
              <section className={styles.sectionCard}>
                <div className={styles.sectionHeader}>
                  <h2 className={styles.sectionTitle}>🎓 Education History</h2>
                  <button
                    onClick={() => setIsEduModalOpen(true)}
                    className={styles.addButton}
                  >
                    ➕ Add Education
                  </button>
                </div>
                <div className={styles.cardGrid}>
                  {userProfile.education.map((edu, index) => (
                    <div key={index} className={styles.infoCard}>
                      <h3>
                        {edu.school} - <span>{edu.degree}</span>
                      </h3>
                      <p>📚 {edu.fieldOfStudy}</p>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            {/* {userProfile.userId.bio != authState.user.userId.bio && (
              <div
                onClick={() => {
                  updateProfileData();
                }}
                className={styles.updateButton}
              >
                Update Profile
              </div>
            )} */}
          </div>
        )}

        {isModalOpen && (
          <div
            onClick={() => {
              setIsModalOpen(false);
            }}
            className={styles.commentsContainer}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className={styles.allCommentsContainer}
            >
              <input
                className={styles.inputField}
                type="text"
                placeholder="Enter company"
                name="company"
                value={inputData.company}
                onChange={handleWorkInputChange}
              />
              <input
                className={styles.inputField}
                type="text"
                name="position"
                placeholder="Enter position"
                value={inputData.position}
                onChange={handleWorkInputChange}
              />
              <input
                className={styles.inputField}
                type="number"
                name="years"
                placeholder="Enter years"
                value={inputData.years}
                onChange={handleWorkInputChange}
              />
              <div
                onClick={() => {
                  const updatedPastWork = [...userProfile.pastWork, inputData];

                  // 1. First: send the complete and updated data to backend
                  updateProfileData({
                    ...userProfile,
                    pastWork: updatedPastWork,
                  });

                  // 2. Then: update local state for immediate UI feedback
                  setUserProfile({
                    ...userProfile,
                    pastWork: updatedPastWork,
                  });

                  setInputData({ company: "", position: "", years: "" });
                  setIsModalOpen(false);
                }}
                className={styles.updateButton}
              >
                Add work
              </div>
            </div>
          </div>
        )}
        {isEduModalOpen && (
          <div
            onClick={() => {
              setIsEduModalOpen(false);
            }}
            className={styles.commentsContainer}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className={styles.allCommentsContainer}
            >
              <input
                className={styles.inputField}
                type="text"
                placeholder="Enter School"
                name="school"
                value={inputEduData.school}
                onChange={handleEduInputChange}
              />
              <input
                className={styles.inputField}
                type="text"
                name="degree"
                placeholder="Enter degree"
                value={inputEduData.degree}
                onChange={handleEduInputChange}
              />
              <input
                className={styles.inputField}
                type="text"
                name="fieldOfStudy"
                placeholder="Enter field of study"
                value={inputEduData.fieldOfStudy}
                onChange={handleEduInputChange}
              />
              <div
                onClick={() => {
                  const updatedEducation = [
                    ...userProfile.education,
                    inputEduData,
                  ];

                  updateProfileData({
                    ...userProfile,
                    education: updatedEducation,
                  });

                  setUserProfile({
                    ...userProfile,
                    education: updatedEducation,
                  });

                  setInputEduData({ school: "", degree: "", fieldOfStudy: "" });
                  setIsEduModalOpen(false);
                }}
                className={styles.updateButton}
              >
                Add Education
              </div>
            </div>
          </div>
        )}
      </DashboardLayout>
    </UserLayout>
  );
};

export default index;
