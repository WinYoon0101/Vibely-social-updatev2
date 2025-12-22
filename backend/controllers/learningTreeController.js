const { LearningTree, TREE_TYPES } = require('../model/LearningTree');

// Tạo cây mới
const createTree = async (req, res) => {
    try {
        const { tree_type } = req.body;

        // Kiểm tra xem user đã có cây chưa
        const existingTree = await LearningTree.findOne({ user_id: req.user.user_id });
        if (existingTree) {
            return res.status(400).json({ message: 'Bạn đã có cây học tập' });
        }

        // Kiểm tra loại cây hợp lệ
        if (!Object.values(TREE_TYPES).includes(tree_type)) {
            return res.status(400).json({ message: 'Loại cây không hợp lệ' });
        }

        // Tạo cây mới với user_id
        const tree = await LearningTree.create({
            user_id: req.user.user_id,
            tree_type
        });

        res.status(201).json(tree);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Lấy thông tin cây
const getTree = async (req, res) => {
    try {
        const tree = await LearningTree.findOne({ user_id: req.user.user_id });

        if (!tree) {
            return res.status(404).json({ message: 'Bạn chưa có cây học tập' });
        }

        res.json(tree);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi lấy thông tin cây', error: error.message });
    }
};

// Cập nhật loại cây
const updateTreeType = async (req, res) => {
    try {
        const { tree_type } = req.body;

        // Kiểm tra loại cây hợp lệ
        if (!Object.values(TREE_TYPES).includes(tree_type)) {
            return res.status(400).json({ message: 'Loại cây không hợp lệ' });
        }

        const tree = await LearningTree.findOneAndUpdate(
            { user_id: req.user.user_id },
            { tree_type },
            { new: true }
        );

        if (!tree) {
            return res.status(404).json({ message: 'Bạn chưa có cây học tập' });
        }

        res.json(tree);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = {
    createTree,
    getTree,
    updateTreeType
}; 