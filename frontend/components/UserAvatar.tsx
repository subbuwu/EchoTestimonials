"use client"

import React from "react";

type UserAvatarProps = {
  image: string;
};

const UserAvatar: React.FC<UserAvatarProps> = ({ image }) => {
  return (
    <div>
      <img
        src={image}
        className="rounded-full h-[4rem] w-[4rem]"
        alt="User Avatar"
      />
    </div>
  );
};

export default UserAvatar;