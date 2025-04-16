const Connection = require('../models/Connection');
const User = require('../models/User');

// Send a connection request
exports.sendConnectionRequest = async (req, res) => {
  try {
    const { mentorId, message } = req.body;
    const menteeId = req.user.id; // Assuming you have authentication middleware

    console.log(`Received connection request: mentee=${menteeId}, mentor=${mentorId}`);

    // Validate that mentor exists
    const mentor = await User.findById(mentorId);
    if (!mentor) {
      return res.status(404).json({ error: 'Mentor not found' });
    }

    // Check if a connection already exists
    const existingConnection = await Connection.findOne({
      mentee: menteeId,
      mentor: mentorId
    });

    if (existingConnection) {
      return res.status(400).json({ 
        error: 'Connection request already exists',
        status: existingConnection.status
      });
    }

    // Create new connection request
    const connection = new Connection({
      mentee: menteeId,
      mentor: mentorId,
      message: message || ''
    });

    await connection.save();
    
    res.status(201).json({ 
      message: 'Connection request sent successfully',
      connection
    });
  } catch (error) {
    console.error('Error sending connection request:', error);
    res.status(500).json({ error: 'Failed to send connection request' });
  }
};

// Get all connection requests for a user
exports.getConnectionRequests = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Get pending requests received (as mentor)
    const receivedRequests = await Connection.find({
      mentor: userId,
      status: 'pending'
    }).populate('mentee', 'name email profilePicture');
    
    // Get sent requests (as mentee)
    const sentRequests = await Connection.find({
      mentee: userId
    }).populate('mentor', 'name email profilePicture');
    
    res.json({
      received: receivedRequests,
      sent: sentRequests
    });
  } catch (error) {
    console.error('Error getting connection requests:', error);
    res.status(500).json({ error: 'Failed to get connection requests' });
  }
};

// Accept or reject a connection request
exports.respondToConnectionRequest = async (req, res) => {
  try {
    const { connectionId, status } = req.body;
    const userId = req.user.id;
    
    if (!['accepted', 'rejected'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }
    
    const connection = await Connection.findById(connectionId);
    
    if (!connection) {
      return res.status(404).json({ error: 'Connection request not found' });
    }
    
    // Verify the user is the mentor for this request
    if (connection.mentor.toString() !== userId) {
      return res.status(403).json({ error: 'Not authorized to respond to this request' });
    }
    
    connection.status = status;
    await connection.save();
    
    res.json({
      message: `Connection request ${status}`,
      connection
    });
  } catch (error) {
    console.error('Error responding to connection request:', error);
    res.status(500).json({ error: 'Failed to respond to connection request' });
  }
};
