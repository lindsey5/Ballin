import CustomerNotification from "../models/CustomerNotification.js";
import { AdminNotification, Customer } from "../models/index.js";

export const getCustomerNotifications = async (req, res) => {
  try {
    // Get page & limit from query params, with defaults
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10; 
    const offset = (page - 1) * limit;

    // Count total notifications
    const total = await CustomerNotification.count({
      where: { customer_id: req.user_id }
    });

    // Fetch paginated notifications
    const notifications = await CustomerNotification.findAll({
      where: { customer_id: req.user_id },
      order: [["date", "DESC"]],
      limit,
      offset,
    });

    const unread = await CustomerNotification.count({
      where: {
        customer_id: req.user_id,
        status: 'unread',
      }
    });

    res.status(200).json({
        success: true,
        notifications,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        unread
    });
  } catch (err) {
    console.log("Error fetching customer notifications:", err);
    res.status(500).json({ error: err.message });
  }
};

export const getAdminNotifications = async (req, res) => {
  try {
    // Get page & limit from query params, with defaults
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10; 
    const offset = (page - 1) * limit;

    // Count total notifications
    const total = await AdminNotification.count({
      where: { admin_id: req.user_id }
    });

    // Fetch paginated notifications
    const notifications = await AdminNotification.findAll({
      where: { admin_id: req.user_id },
      order: [["date", "DESC"]],
      include: [ { model: Customer }],
      limit,
      offset,
    });

    const unread = await AdminNotification.count({
      where: {
        admin_id: req.user_id,
        status: 'unread',
      }
    });

    res.status(200).json({
        success: true,
        notifications,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        unread
    });
  } catch (err) {
    console.log("Error fetching admin notifications:", err);
    res.status(500).json({ error: err.message });
  }
};

export const adminMarkAllReadNotifications = async (req, res) => {
  try {
    await AdminNotification.update(
      { status: 'read' },
      { where: { admin_id: req.user_id, status: 'unread' } }
    );

    res.status(200).json({ success: true, message: 'All notifications marked as read' });
  } catch (err) {
    console.log("Error marking notifications as read:", err);
    res.status(500).json({ error: err.message });
  }
};

export const customerMarkAllReadNotifications = async (req, res) => {
  try {
    await CustomerNotification.update(
      { status: 'read' },
      { where: { customer_id: req.user_id, status: 'unread' } }
    );

    res.status(200).json({ success: true, message: 'All notifications marked as read' });
  } catch (err) {
    console.log("Error marking notifications as read:", err);
    res.status(500).json({ error: err.message });
  }
};


export const customerMarkReadNotificationById = async (req, res) => {
  try {
    const notification = await CustomerNotification.findByPk(req.params.id);

    if (!notification) {
      return res.status(404).json({ error: "Notification not found." });
    }

    if (notification.customer_id !== req.user_id) {
      return res.status(403).json({ error: "Not authorized to update this notification." });
    }

    notification.status = "read";
    await notification.save();

    res.status(200).json({ success: true, message: "Notification marked as read" });
  } catch (err) {
    console.log("Error marking notification as read:", err);
    res.status(500).json({ error: err.message });
  }
};

export const adminMarkReadNotificationById = async (req, res) => {
  try {
    const notification = await AdminNotification.findByPk(req.params.id);

    if (!notification) {
      return res.status(404).json({ error: "Notification not found." });
    }

    if (notification.admin_id !== req.user_id) {
      return res.status(403).json({ error: "Not authorized to update this notification." });
    }

    notification.status = "read";
    await notification.save();

    res.status(200).json({ success: true, message: "Notification marked as read" });
  } catch (err) {
    console.log("Error marking notification as read:", err);
    res.status(500).json({ error: err.message });
  }
};