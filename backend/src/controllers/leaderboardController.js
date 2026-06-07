import { User }
from "../models/User.js";

export const getLeaderboard =
async (req, res) => {
  try {
    const leaderboard =
      await User.find({
        role: "participant",
      })
        .sort({
          points: -1,
        })
        .select(
          "name email points"
        )
        .limit(10);

    res.json(leaderboard);
  } catch (error) {
    res.status(500).json({
      message:
        error.message,
    });
  }
};