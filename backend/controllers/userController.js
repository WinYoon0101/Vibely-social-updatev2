const Notification = require("../model/Notification");
const User = require("../model/User");
const response = require("../utils/responseHandler");
const { getUser } = require("../socket.js");

// Theo dõi người dùng
const followUser = async (req, res) => {
  const { userIdToFollow } = req.body;
  const userId = req?.user?.userId;

  if (userId === userIdToFollow) {
    return response(res, 400, "Bạn không được phép theo dõi chính mình");
  }
  try {
    const userToFollow = await User.findById(userIdToFollow);
    const currentUser = await User.findById(userId);

    if (!userToFollow || !currentUser) {
      return response(res, 404, "Người dùng không tồn tại");
    }

    if (currentUser.followings.includes(userIdToFollow)) {
      return response(res, 404, "Bạn đã theo dõi người dùng này");
    }

    currentUser.followings.push(userIdToFollow);
    userToFollow.followers.push(currentUser);

    currentUser.followingCount += 1;
    userToFollow.followerCount += 1;

    await currentUser.save();
    await userToFollow.save();

    const existingNotif = await Notification.findOne({
      type: "friends",
      user: currentUser._id, // notif gửi cho currentUser
      targetId: userToFollow._id, // người gửi là userToFollow
    });
    const io = req.app.get("io");
    if (!existingNotif) {
      const opponent = getUser(userIdToFollow);
      const newNotif = new Notification({
        user: userIdToFollow, // gửi cho userToFollow
        type: "friends",
        content: "đã gửi lời mời kết bạn.",
        thumbnailUrl: currentUser.profilePicture,
        targetId: currentUser._id,
        lastSenderId: currentUser.username,
        senderCount: 1,
      });
      await newNotif.save();
      if (opponent) {
        io.to(opponent.socketId).emit("getNotification", newNotif);
      }
    } else {
      existingNotif.content = `Bạn và ${userToFollow.username} bây giờ là bạn bè.`;
      existingNotif.senderCount = 0;
      existingNotif.isRead = false; // cho nổi bật lại
      await existingNotif.save();
      const newNotif = new Notification({
        user: userIdToFollow, // gửi cho userToFollow
        type: "friends",
        content: `Bạn và ${currentUser.username} bây giờ là bạn bè.`,
        thumbnailUrl: currentUser.profilePicture,
        targetId: currentUser._id,
        lastSenderId: currentUser.username,
        senderCount: 0,
      });
      await newNotif.save();
      const opponent = getUser(userIdToFollow);
      const me = getUser(currentUser._id);
      if (opponent) {
        io.to(opponent.socketId).emit("refetchNotification");
      }
      if (me) {
        io.to(me.socketId).emit("refetchNotification");
      }
    }
    return response(res, 200, "Theo dõi người dùng thành công");
  } catch (error) {
    console.log(error);
    return response(res, 500, "Lỗi máy chủ nội bộ", error.message);
  }
};

// Bỏ theo dõi người dùng
const unfollowUser = async (req, res) => {
  const { userIdToUnfollow } = req.body;
  const userId = req?.user?.userId;

  if (userId === userIdToUnfollow) {
    return response(res, 400, "Bạn không được phép bỏ theo dõi chính mình");
  }
  try {
    const userToUnfollow = await User.findById(userIdToUnfollow);
    const currentUser = await User.findById(userId);

    if (!userToUnfollow || !currentUser) {
      return response(res, 404, "Người dùng không tồn tại");
    }

    if (!currentUser.followings.includes(userIdToUnfollow)) {
      return response(res, 404, "Bạn chưa theo dõi người dùng này");
    }

    await User.updateMany(
      { _id: { $in: [userId, userIdToUnfollow] } },
      {
        $pull: {
          followers: { $in: [userId, userIdToUnfollow] },
          followings: { $in: [userId, userIdToUnfollow] },
        },
      },
    );

    currentUser.followingCount = Math.max(0, currentUser.followingCount - 1);
    currentUser.followerCount = Math.max(0, currentUser.followerCount - 1);
    userToUnfollow.followingCount = Math.max(
      0,
      userToUnfollow.followingCount - 1,
    );
    userToUnfollow.followerCount = Math.max(
      0,
      userToUnfollow.followerCount - 1,
    );

    await currentUser.save();
    await userToUnfollow.save();

    await Notification.deleteMany({
      type: "friends",
      targetId: { $in: [userId, userIdToUnfollow] },
    });

    return response(res, 200, "Bỏ theo dõi người dùng thành công");
  } catch (error) {
    return response(res, 500, "Lỗi máy chủ nội bộ", error.message);
  }
};

// Xóa lời mời kết bạn
const deleteUserFromRequest = async (req, res) => {
  try {
    const loggedInUserId = req.user.userId;
    const { requestSenderId } = req.body;

    const requestSender = await User.findById(requestSenderId);
    const loggedInUser = await User.findById(loggedInUserId);

    if (!requestSender || !loggedInUser) {
      return response(res, 404, "Người dùng không tồn tại");
    }

    const isRequestSend = requestSender.followings.includes(loggedInUserId);
    if (!isRequestSend) {
      return response(res, 404, "Không tìm thấy yêu cầu kết bạn");
    }

    requestSender.followings = requestSender.followings.filter(
      (user) => user.toString() !== loggedInUserId,
    );
    loggedInUser.followers = loggedInUser.followers.filter(
      (user) => user.toString() !== requestSenderId,
    );

    loggedInUser.followerCount = loggedInUser.followers.length;
    requestSender.followingCount = requestSender.followings.length;

    await loggedInUser.save();
    await requestSender.save();

    return response(
      res,
      200,
      `Lời mời kết bạn từ ${requestSender.username} đã bị xóa`,
    );
  } catch (error) {
    return response(res, 500, "Lỗi máy chủ nội bộ", error.message);
  }
};

// Lấy tất cả lời mời kết bạn của người dùng
const getAllFriendsRequest = async (req, res) => {
  try {
    const loggedInUserId = req.user.userId;

    const loggedInUser = await User.findById(loggedInUserId).select(
      "followers followings",
    );
    if (!loggedInUser) {
      return response(res, 404, "Người dùng không tồn tại");
    }

    // Tìm người dùng theo dõi người dùng đăng nhập nhưng không được theo dõi lại
    const userToFollowBack = await User.find({
      _id: {
        $in: loggedInUser.followers,
        $nin: loggedInUser.followings,
      },
    }).select("username profilePicture email followerCount");

    return response(
      res,
      200,
      "Lấy tất cả lời mời kết bạn thành công",
      userToFollowBack,
    );
  } catch (error) {
    return response(res, 500, "Lỗi máy chủ nội bộ", error.message);
  }
};

// Lấy tất cả đề xuất kết bạn của người dùng (với thuật toán thông minh)
const getAllUserForRequest = async (req, res) => {
  try {
    const loggedInUserId = req.user.userId;

    const loggedInUser = await User.findById(loggedInUserId)
      .select("followers followings")
      .populate("bio");

    if (!loggedInUser) {
      return response(res, 404, "Người dùng không tồn tại");
    }

    // Lấy danh sách ứng viên (những người không phải bạn bè)
    const candidates = await User.find({
      _id: {
        $ne: loggedInUser,
        $nin: [...loggedInUser.followings, ...loggedInUser.followers],
      },
    })
      .select(
        "username profilePicture email followerCount followers followings",
      )
      .populate("bio");

    // Tính điểm ưu tiên cho mỗi ứng viên
    const candidatesWithScore = candidates.map((candidate) => {
      // 1. Tính số bạn chung
      const loggedInFollowingSet = new Set(
        loggedInUser.followings.map((id) => id.toString()),
      );
      const mutualFriendsCount = candidate.followers.filter((followerId) =>
        loggedInFollowingSet.has(followerId.toString()),
      ).length;

      // 2. Tính điểm tương đồng bio
      let bioScore = 0;
      if (loggedInUser.bio && candidate.bio) {
        const userBio = loggedInUser.bio;
        const candidateBio = candidate.bio;

        // So sánh các trường bio (case-insensitive)
        if (
          userBio.workplace &&
          candidateBio.workplace &&
          userBio.workplace.toLowerCase().trim() ===
            candidateBio.workplace.toLowerCase().trim()
        ) {
          bioScore += 1;
        }
        if (
          userBio.education &&
          candidateBio.education &&
          userBio.education.toLowerCase().trim() ===
            candidateBio.education.toLowerCase().trim()
        ) {
          bioScore += 1;
        }
        if (
          userBio.hometown &&
          candidateBio.hometown &&
          userBio.hometown.toLowerCase().trim() ===
            candidateBio.hometown.toLowerCase().trim()
        ) {
          bioScore += 1;
        }
        if (
          userBio.liveIn &&
          candidateBio.liveIn &&
          userBio.liveIn.toLowerCase().trim() ===
            candidateBio.liveIn.toLowerCase().trim()
        ) {
          bioScore += 1;
        }
      }

      // 3. Tính tổng điểm (bạn chung quan trọng hơn)
      const totalScore = mutualFriendsCount * 10 + bioScore * 5;

      return {
        _id: candidate._id,
        username: candidate.username,
        profilePicture: candidate.profilePicture,
        email: candidate.email,
        followerCount: candidate.followerCount,
        score: totalScore,
        mutualFriendsCount: mutualFriendsCount,
        bioSimilarity: bioScore,
      };
    });

    // 4. Sắp xếp theo điểm giảm dần
    candidatesWithScore.sort((a, b) => b.score - a.score);

    // 5. Giới hạn kết quả (top 8)
    const topSuggestions = candidatesWithScore.slice(0, 8);

    // 6. Loại bỏ metadata scoring trước khi trả về 
    const finalSuggestions = topSuggestions.map(
      ({ _id, username, profilePicture, email, followerCount }) => ({
        _id,
        username,
        profilePicture,
        email,
        followerCount,
      }),
    );

    return response(
      res,
      200,
      "Lấy tất cả đề xuất kết bạn thành công",
      finalSuggestions,
    );
  } catch (error) {
    console.error("Error in getAllUserForRequest:", error);
    return response(res, 500, "Lỗi máy chủ nội bộ", error.message);
  }
};

// Lấy danh sách bạn chung
const getAllMutualFriends = async (req, res) => {
  try {
    const ProfileUserId = req.params.userId;

    const loggedInUser = await User.findById(ProfileUserId)
      .select("followers followings")
      .populate(
        "followings",
        "username profilePicture email followerCount followingCount",
      )
      .populate(
        "followers",
        "username profilePicture email followerCount followingCount",
      );

    if (!loggedInUser) {
      return response(res, 404, "Người dùng không tồn tại");
    }

    // Tạo một tập hợp id người dùng mà người đăng nhập đang theo dõi
    const followingUserId = new Set(
      loggedInUser.followings.map((user) => user._id.toString()),
    );

    // Lọc người theo dõi của người đăng nhập để chỉ lấy những người được theo dõi bởi người đăng nhập
    const mutualFriends = loggedInUser.followers.filter((follower) =>
      followingUserId.has(follower._id.toString()),
    );

    return response(
      res,
      200,
      "Lấy danh sách bạn chung thành công",
      mutualFriends,
    );
  } catch (error) {
    return response(res, 500, "Lỗi máy chủ nội bộ", error.message);
  }
};

// Lấy tất cả người dùng để tìm kiếm hồ sơ
const getAllUser = async (req, res) => {
  try {
    const users = await User.find().select(
      "username profilePicture email followerCount",
    );
    return response(res, 200, "Lấy tất cả người dùng thành công", users);
  } catch (error) {
    return response(res, 500, "Lỗi máy chủ nội bộ", error.message);
  }
};

// Kiểm tra xem người dùng đã đăng nhập chưa
const checkUserAuth = async (req, res) => {
  try {
    const userId = req?.user?.userId;
    if (!userId)
      return response(
        res,
        404,
        "Chưa xác thực! Vui lòng đăng nhập trước khi truy cập vào dữ liệu",
      );

    // Nạp thông tin người dùng và loại bỏ thông tin nhạy cảm
    const user = await User.findById(userId).select("-password");
    if (!user) return response(res, 403, "Người dùng không tồn tại");

    return response(res, 201, "Người dùng đã đăng nhập", user);
  } catch (error) {
    return response(res, 500, "Lỗi máy chủ nội bộ", error.message);
  }
};

// Lấy thông tin hồ sơ người dùng
const getUserProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    const loggedInUserId = req?.user?.userId;

    // Nạp thông tin người dùng và loại bỏ thông tin nhạy cảm
    const userProfile = await User.findById(userId)
      .select("-password")
      .populate("bio");

    if (!userProfile) return response(res, 404, "Người dùng không tồn tại");

    const isOwner = loggedInUserId === userId;

    return response(res, 200, "Lấy hồ sơ người dùng thành công", {
      profile: userProfile,
      isOwner,
    });
  } catch (error) {
    return response(res, 500, "Lỗi máy chủ nội bộ", error.message);
  }
};

// Lấy thông tin người dùng theo ID
const getUsersByIds = async (req, res) => {
  try {
    const { userIds } = req.body;
    if (!userIds || userIds.length === 0) {
      return res.status(400).json({ message: "Danh sách userId trống!" });
    }

    const users = await User.find({ _id: { $in: userIds } }).select(
      "-password -updatedAt",
    );
    res.status(200).json({ data: users });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Lỗi khi lấy danh sách người dùng!", error });
  }
};

// Lấy danh sách bạn bè (followers + followings)
const getUserMutualFriends = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId)
      .select("followers followings")
      .populate(
        "followings",
        "username profilePicture email followerCount followingCount",
      )
      .populate(
        "followers",
        "username profilePicture email followerCount followingCount",
      );

    if (!user) {
      return response(res, 404, "Người dùng không tồn tại");
    }

    // Tạo một tập hợp ID những người mà user đang theo dõi
    const followingUserId = new Set(
      user.followings.map((user) => user._id.toString()),
    );

    // Lọc danh sách followers để tìm mutual friends
    const mutualFriends = user.followers.filter((follower) =>
      followingUserId.has(follower._id.toString()),
    );

    return response(
      res,
      200,
      "Lấy danh sách bạn chung thành công",
      mutualFriends,
    );
  } catch (error) {
    return response(res, 500, "Lỗi máy chủ nội bộ", error.message);
  }
};

// Lấy danh sách tài liệu đã lưu của người dùng
const getSavedDocuments = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { query, level, subject } = req.query;

    let filter = {};
    if (query) filter.title = { $regex: query, $options: "i" };
    if (level) filter.level = level;
    if (subject) filter.subject = subject;

    const user = await User.findById(userId).populate({
      path: "savedDocuments",
      match: filter,
      populate: [
        { path: "level", select: "name" },
        { path: "subject", select: "name" },
      ],
    });

    return response(
      res,
      200,
      "Lấy danh sách tài liệu đã lưu thành công",
      user?.savedDocuments || [],
    );
  } catch (error) {
    return response(res, 500, "Lỗi máy chủ nội bộ", error.message);
  }
};

// Lấy thông tin tài liệu đã lưu theo ID
const getSavedDocumentById = async (req, res) => {
  try {
    const userId = req.user.userId;
    const documentId = req.params.id;

    const user = await User.findOne(
      { _id: userId, savedDocuments: documentId },
      { "savedDocuments.$": 1 },
    ).populate({
      path: "savedDocuments",
      populate: [
        { path: "level", select: "name" },
        { path: "subject", select: "name" },
      ],
    });

    if (!user || !user.savedDocuments.length) {
      return response(
        res,
        404,
        "Tài liệu không tồn tại trong danh sách đã lưu",
      );
    }

    return response(
      res,
      200,
      "Lấy thông tin tài liệu đã lưu thành công",
      user.savedDocuments[0],
    );
  } catch (error) {
    return response(res, 500, "Lỗi máy chủ nội bộ", error.message);
  }
};

// Bỏ lưu tài liệu
const unsaveDocument = async (req, res) => {
  try {
    const userId = req.user.userId;
    const documentId = req.params.id;

    const user = await User.findById(userId);
    if (!user) {
      return response(res, 404, "Người dùng không tồn tại");
    }

    // Kiểm tra tài liệu có trong danh sách đã lưu không
    const documentIndex = user.savedDocuments.findIndex(
      (doc) => doc.toString() === documentId,
    );
    if (documentIndex === -1) {
      return response(
        res,
        404,
        "Tài liệu không tồn tại trong danh sách đã lưu",
      );
    }

    // Xóa tài liệu khỏi danh sách đã lưu
    user.savedDocuments.splice(documentIndex, 1);
    await user.save();

    return response(res, 200, "Bỏ lưu tài liệu thành công");
  } catch (error) {
    return response(res, 500, "Lỗi máy chủ nội bộ", error.message);
  }
};

module.exports = {
  followUser,
  unfollowUser,
  deleteUserFromRequest,
  getAllFriendsRequest,
  getAllUserForRequest,
  getAllMutualFriends,
  getAllUser,
  checkUserAuth,
  getUserProfile,
  getUsersByIds,
  getUserMutualFriends,
  getSavedDocuments,
  getSavedDocumentById,
  unsaveDocument,
};
