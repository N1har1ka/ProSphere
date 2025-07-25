import { getAllUsers } from "@/config/redux/action/authAction";
import DashboardLayout from "@/layout/DashboardLayout";
import UserLayout from "@/layout/UserLayout";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "./style.module.css";
import { BASE_URL } from "@/config";
import { useRouter } from "next/navigation";
const DiscoverPage = () => {
  const authState = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const router = useRouter();
  useEffect(() => {
    if (!authState.all_profiles_fetched) {
      dispatch(getAllUsers());
    }
    console.log(authState.user);
  }, []);
  return (
    <UserLayout>
      <DashboardLayout>
        <div>
          <h1>Discover</h1>
          <div className={styles.allUserProfile}>
            {authState.all_profiles_fetched &&
              authState.user?._id &&
              authState.all_users
                .filter(
                  (profile) => profile.userId._id !== authState.user.userId._id
                )
                .map((user) => {
                  return (
                    <div
                      onClick={() => {
                        router.push(`/view_profile/${user.userId.username}`);
                      }}
                      key={user._id}
                      className={styles.userCard}
                    >
                      <img
                        className={styles.userCard_image}
                        src={`${BASE_URL}/${user.userId.profilePicture}`}
                        alt="profile"
                      />
                      <div>
                        <h1>{user.userId.name}</h1>
                        <p>@{user.userId.username}</p>
                      </div>
                    </div>
                  );
                })}
          </div>
        </div>
      </DashboardLayout>
    </UserLayout>
  );
};

export default DiscoverPage;
