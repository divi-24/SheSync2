import Community from "../models/Community.js";
import { Types } from "mongoose";
import User from "../models/user.js";

    // Create a new community
export const createCommunity = async (req, res) => {
    try {
        const { name, description } = req.body;
        const userId = req.user.id; // comes from auth middleware

        // Check required fields
        if (!name || !description) {
            return res.status(400).json({ 
                success: false,
                error: "Name and description are required." 
            });
        }

        // Check if community with same name exists
        const existingCommunity = await Community.findOne({ name });
        if (existingCommunity) {
            return res.status(400).json({ 
                success: false,
                error: "Community with this name already exists." 
            });
        }

        // Generate slug from name
        const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

        // Create new community
        const community = new Community({
            name,
            slug,
            description,
            createdBy: userId,
            members: [userId], // creator automatically becomes a member
        });

        await community.save();

        // Update user's joinedCommunities
        await User.findByIdAndUpdate(userId, { $push: { joinedCommunities: community._id } });

        res.status(201).json({
            success: true,
            message: "Community created successfully",
            data: community,
        });
    } catch (error) {
        console.error("Error creating community:", error);
        res.status(500).json({ 
            success: false,
            error: "Failed to create community" 
        });
    }
};

    // 📌 JOIN a community
export const joinCommunity = async (req, res) => {
            try {
                    const { id } = req.params;
                    const userId = req.user.id;
                    
                    if (!Types.ObjectId.isValid(id)) {
                            return res.status(400).json({
                                    success: false,
                                    error: "Invalid community ID"
                            });
                    }

                    const community = await Community.findById(id);
                    if (!community) {
                            return res.status(404).json({
                                    success: false,
                                    error: "Community not found"
                            });
                    }

                    const isAlreadyMember = community.members.some(
                            memberId => memberId.toString() === userId.toString()
                    );
                    
                    if (isAlreadyMember) {
                            return res.status(409).json({
                                    success: false,
                                    error: "Already a member of this community"
                            });
                    }

                    community.members.push(userId);
                    await community.save();

                    // Update user's joinedCommunities
                    await User.findByIdAndUpdate(userId, { $push: { joinedCommunities: community._id } });

                    res.status(200).json({
                            success: true,
                            message: "Successfully joined community",
                            data: { communityId: community._id, membersCount: community.members.length }
                    });
            } catch (error) {
                    console.error("Error joining community:", error);
                    res.status(500).json({
                            success: false,
                            error: "Failed to join community"
                    });
            }
    };

    // 📌 LEAVE a community
export const leaveCommunity = async (req, res) => {
        try {
                    const { id } = req.params;
                    const userId = req.user.id;
                    
                    if (!Types.ObjectId.isValid(id)) {
                            return res.status(400).json({
                                    success: false,
                                    error: "Invalid community ID"
                            });
                    }

                    const community = await Community.findById(id);
                    if (!community) {
                            return res.status(404).json({
                                    success: false,
                                    error: "Community not found"
                            });
                    }

                    const isMember = community.members.some(
                            memberId => memberId.toString() === userId.toString()
                    );
                    
                    if (!isMember) {
                            return res.status(400).json({
                                    success: false,
                                    error: "Not a member of this community"
                            });
                    }

                    community.members = community.members.filter(
                            memberId => memberId.toString() !== userId.toString()
                    );
                    await community.save();

                    // Update user's joinedCommunities
                    await User.findByIdAndUpdate(userId, { $pull: { joinedCommunities: community._id } });

                    res.status(200).json({
                            success: true,
                            message: "Successfully left community",
                            data: { communityId: community._id, membersCount: community.members.length }
                    });
            } catch (error) {
                    console.error("Error leaving community:", error);
                    res.status(500).json({
                            success: false,
                            error: "Failed to leave community"
                    });
            }
    };


// 📌 GET all communities
export const getCommunities = async (req, res) => {
    try {
        const communities = await Community.find();
        
        res.status(200).json({
            success: true,
            data: communities,
            count: communities.length
        });
    } catch (error) {
        console.error("Error fetching communities:", error);
        res.status(500).json({
            success: false,
            error: "Failed to fetch communities"
        });
    }
};

// 📌 GET single community
export const getCommunity = async (req, res) => {
    try {
        const { id } = req.params;
        
        if (!Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                error: "Invalid community ID"
            });
        }

        const community = await Community.findById(id);
            
        if (!community) {
            return res.status(404).json({
                success: false,
                error: "Community not found"
            });
        }
        
        res.status(200).json({
            success: true,
            data: community
        });
    } catch (error) {
        console.error("Error fetching community:", error);
        res.status(500).json({
            success: false,
            error: "Failed to fetch community"
        });
    }
};

