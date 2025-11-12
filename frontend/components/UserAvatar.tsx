"use client"

import React from "react";
import Image from "next/image";

type UserAvatarProps = {
  image: string;
};

const UserAvatar: React.FC<UserAvatarProps> = ({ image }) => {
  return (
    <div>
      <Image
        src={image}
        width={64}
        height={64}
        className="rounded-full"
        alt="User Avatar"
      />
    </div>
  );
};

export default UserAvatar;