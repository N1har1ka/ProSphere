import React, { useEffect, useState } from "react";
import styles from "./styles.module.css";
import UserLayout from "@/layout/UserLayout";
import DashboardLayout from "@/layout/DashboardLayout";
import { useDispatch, useSelector } from "react-redux";
import { getAboutUser } from "@/config/redux/action/authAction";
import { BASE_URL, clientServer } from "@/config";
import { getAllPosts } from "@/config/redux/action/postAction";
import { useRouter } from "next/router";
const index = () => {
  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth);
  const postReducer = useSelector((state) => state.postReducer);
  const router = useRouter();
  const [userProfile, setUserProfile] = useState([]);
  const [userPosts, setUserPosts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [inputData, setInputData] = useState({
    company: "",
    position: "",
    years: "",
  });
  const handleWorkInputChange = (e) => {
    const { name, value } = e.target;
    setInputData({ ...inputData, [name]: value });
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
  const updateProfileData = async () => {
    const request = await clientServer.post("/user_update", {
      token: localStorage.getItem("token"),
      name: userProfile.userId.name,
    });
    const response = await clientServer.post("/update_profile_data", {
      token: localStorage.getItem("token"),
      bio: userProfile.bio,
      currentWork: userProfile.currentWork,
      pastWork: userProfile.pastWork,
      education: userProfile.education,
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
              <div style={{ display: "flex", gap: "0.7rem" }}>
                <div style={{ flex: "0.8" }}>
                  <div
                    style={{
                      display: "flex",
                      width: "fit-content",
                      alignItems: "center",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        width: "fit-content",
                        alignItems: "center",
                        gap: "1.2rem",
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
                    </div>
                    <p style={{ color: "grey" }}>
                      @{userProfile.userId.username}
                    </p>
                  </div>

                  <div>
                    <textarea
                      name=""
                      id=""
                      value={userProfile.bio}
                      onChange={(e) => {
                        setUserProfile({
                          ...userProfile,
                          bio: e.target.value,
                        });
                      }}
                      style={{ width: "100%" }}
                      rows={Math.max(3, Math.ceil(userProfile.bio.length / 80))}
                    ></textarea>
                  </div>
                </div>
                <div style={{ flex: "0.2" }}>
                  <h3>Recent Activity</h3>
                  {userPosts.map((post) => {
                    return (
                      <div key={post._id} className={styles.postCard}>
                        <div className={styles.card}>
                          <div className={styles.card_profileContainer}>
                            {post.media !== "" ? (
                              <img src={`${BASE_URL}/${post.media}`}></img>
                            ) : (
                              <div
                                style={{ width: "3.4rem", height: "3.4rem" }}
                              ></div>
                            )}
                          </div>
                          <p>{post.body}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            <div className={styles.workHistory}>
              <h4>Work History</h4>
              <div className={styles.workHistoryContainer}>
                {userProfile.pastWork.map((work, index) => {
                  return (
                    <div key={index} className={styles.workHistoryCard}>
                      <p
                        style={{
                          fontWeight: "bold",
                          display: "flex",
                          alignItems: "center",
                          gap: "0.8rem",
                        }}
                      >
                        {work.company} - {work.position}
                      </p>
                      <p>{work.years}</p>
                    </div>
                  );
                })}
                <button
                  onClick={() => {
                    setIsModalOpen(true);
                  }}
                  className={styles.addWorkButton}
                >
                  Add work
                </button>
              </div>
            </div>

            {userProfile != authState.user && (
              <div
                onClick={() => {
                  updateProfileData();
                }}
                className={styles.updateButton}
              >
                Update Profile
              </div>
            )}
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
                value={userProfile.pastWork.company}
                onChange={handleWorkInputChange}
              />
              <input
                className={styles.inputField}
                type="text"
                name="position"
                placeholder="Enter position"
                value={userProfile.pastWork.position}
                onChange={handleWorkInputChange}
              />
              <input
                className={styles.inputField}
                type="number"
                name="years"
                placeholder="Enter years"
                value={userProfile.pastWork.years}
                onChange={handleWorkInputChange}
              />
              <div
                onClick={() => {
                  setUserProfile({
                    ...userProfile,
                    pastWork: [...userProfile.pastWork, inputData],
                  });
                  setIsModalOpen(false);
                }}
                className={styles.updateButton}
              >
                Add work
              </div>
            </div>
          </div>
        )}
      </DashboardLayout>
    </UserLayout>
  );
};

export default index;
