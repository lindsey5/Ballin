import LowStockNotification from "../models/LowStockNotification.js";

export const getLowStockNotifications = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const status = req.query?.status; 

    const where = { admin_id: req.user_id };
    if (status && status !== 'All') {
      where.status = status;
    }

    const { count, rows } = await LowStockNotification.findAndCountAll({
      where,
      limit,
      offset,
      order: [["date", "DESC"]],
    });

    res.status(200).json({
      success: true,
      lowStockNotifications: rows,
      total: count,
      page,
      limit,
      totalPages: Math.ceil(count / limit),
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};

export const markAsRead = async (req, res) => {
  try {
    const notification = await LowStockNotification.findByPk(req.params.id);

    if(!notification){
        return res.status(404).json( { error: 'Low Stock Notification not found.'})
    }

    notification.status = 'read';
    await notification.save();

    res.status(200).json({ success: true, message: `notification marked as read`,});
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

export const markAllAsRead = async (req, res) => {
  try {
    await LowStockNotification.update(
      { status: 'read' },
      { where: { admin_id: req.user_id } }
    );

    res.status(200).json({ success: true, message: `all notifications marked as read`,});
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};