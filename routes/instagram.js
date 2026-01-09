const express = require('express');
const router = express.Router();
const axios = require('axios');

// Environment variables (placeholder for now)
const INSTAGRAM_ACCESS_TOKEN = process.env.INSTAGRAM_ACCESS_TOKEN;
const FACEBOOK_APP_ID = '24900594382952740';
const FACEBOOK_APP_SECRET = 'd10d9195be2b06de4818f28c7a76aaae';

// Mock Data matching the reference image styles
const MOCK_POSTS = [
    {
        id: '1',
        caption: 'In today\'s fast-evolving marketing landscape, data driven AI combined with strategic human creativity is the winning formula. At VVWorx, we harness this synergy to design campaigns that lead industries, not follow.',
        media_url: '/vua.jpeg', // Using existing relevant image
        media_type: 'IMAGE',
        timestamp: '2025-11-15T10:00:00Z',
        username: 'Voix & Vision Worx',
        permalink: 'https://instagram.com',
        like_count: 12,
        comments_count: 0
    },
    {
        id: '2',
        caption: 'Because why use boring charts when samosas are crispy hot, and the ultimate funnel hack? Marketing Funnel - 5 pages',
        media_url: '/strategy.jpeg', // Using existing relevant image
        media_type: 'IMAGE',
        timestamp: '2025-11-10T14:30:00Z',
        username: 'Voix & Vision Worx',
        permalink: 'https://instagram.com',
        like_count: 11,
        comments_count: 2
    },
    {
        id: '3',
        caption: 'Not just building solutions we\'re designing revolutions. This is our mark of innovation. #NextGenThinking #InnovateWithUs #MarkOfInnovation',
        media_url: '/digital.jpeg', // Using existing relevant image
        media_type: 'IMAGE',
        timestamp: '2025-11-05T09:15:00Z',
        username: 'Voix & Vision Worx',
        permalink: 'https://instagram.com',
        like_count: 15,
        comments_count: 1
    }
];

// GET /api/instagram/posts
router.get('/posts', async (req, res) => {
    try {
        // If we had a valid token, we would fetch real data:
        if (INSTAGRAM_ACCESS_TOKEN) {
            // const response = await axios.get(`https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,thumbnail_url,permalink,timestamp,username&access_token=${INSTAGRAM_ACCESS_TOKEN}&limit=3`);
            // return res.json({ success: true, data: response.data.data });
        }

        // Return mock data for now
        res.json({
            success: true,
            data: MOCK_POSTS
        });

    } catch (error) {
        console.error('Error fetching Instagram posts:', error.message);
        // Fallback to mock data even on error to ensure UI works
        res.json({
            success: true,
            data: MOCK_POSTS
        });
    }
});

module.exports = router;
