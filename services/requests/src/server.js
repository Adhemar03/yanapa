require('dotenv').config();
require('express-async-errors');

const express = require('express');
const requestsService = require('./requests.service');
const authMiddleware = require('./middleware/auth');

const app = express();
const PORT = process.env.PORT || 4002;
const CORS_ORIGIN = process.env.CORS_ORIGIN || '*';

// Middleware
app.use(express.json());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', CORS_ORIGIN);
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', service: 'requests' });
});

// POST /requests - Create a new request
app.post('/requests', authMiddleware, async (req, res) => {
  try {
    const { categoryId, description, address } = req.body;
    const userId = req.user.sub;

    // Validations
    if (!categoryId || !description || !address) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: categoryId, description, address',
      });
    }

    if (description.trim().length < 10) {
      return res.status(400).json({
        success: false,
        error: 'Description must be at least 10 characters',
      });
    }

    const request = await requestsService.createRequest({
      userId,
      categoryId,
      description: description.trim(),
      address: address.trim(),
    });

    res.status(201).json({
      success: true,
      data: request,
    });
  } catch (error) {
    console.error('Error creating request:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// GET /requests/my - Get user's requests
app.get('/requests/my', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.sub;
    const requests = await requestsService.getRequestsByUser(userId);

    res.json({
      success: true,
      data: requests,
    });
  } catch (error) {
    console.error('Error fetching requests:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// GET /requests/history - Get user's request history
app.get('/requests/history', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.sub;
    const history = await requestsService.getRequestHistory(userId);

    res.json({
      success: true,
      data: history,
    });
  } catch (error) {
    console.error('Error fetching history:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// GET /requests/active - Get user's active requests
app.get('/requests/active', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.sub;
    const active = await requestsService.getActiveRequests(userId);

    res.json({
      success: true,
      data: active,
    });
  } catch (error) {
    console.error('Error fetching active requests:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// GET /requests/:id - Get request by ID
app.get('/requests/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const request = await requestsService.getRequestById(id);

    if (!request) {
      return res.status(404).json({
        success: false,
        error: 'Request not found',
      });
    }

    // Verify user owns this request
    const userId = req.user.email || req.user.sub;
    if (request.user_id !== userId) {
      return res.status(403).json({
        success: false,
        error: 'Unauthorized',
      });
    }

    res.json({
      success: true,
      data: request,
    });
  } catch (error) {
    console.error('Error fetching request:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// PUT /requests/:id/status - Update request status
app.put('/requests/:id/status', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        error: 'Status is required',
      });
    }

    const validStatuses = ['pendiente', 'aceptada', 'rechazada', 'en_proceso', 'finalizada', 'cancelada'];
    if (!validStatuses.includes(status.toLowerCase())) {
      return res.status(400).json({
        success: false,
        error: `Invalid status. Must be one of: ${validStatuses.join(', ')}`,
      });
    }

    const request = await requestsService.getRequestById(id);
    if (!request) {
      return res.status(404).json({
        success: false,
        error: 'Request not found',
      });
    }

    // Verify user owns this request
    const userId = req.user.email || req.user.sub;
    if (request.user_id !== userId) {
      return res.status(403).json({
        success: false,
        error: 'Unauthorized',
      });
    }

    const updated = await requestsService.updateRequestStatus(id, status.toLowerCase());

    res.json({
      success: true,
      data: updated,
    });
  } catch (error) {
    console.error('Error updating request status:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// DELETE /requests/:id - Cancel request
app.delete('/requests/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    const request = await requestsService.getRequestById(id);
    if (!request) {
      return res.status(404).json({
        success: false,
        error: 'Request not found',
      });
    }

    // Verify user owns this request
    const userId = req.user.email || req.user.sub;
    if (request.user_id !== userId) {
      return res.status(403).json({
        success: false,
        error: 'Unauthorized',
      });
    }

    // Only allow cancellation if status is pendiente, aceptada or en_proceso
    const cancelableStatuses = ['pendiente', 'aceptada', 'en_proceso'];
    if (!cancelableStatuses.includes(request.status)) {
      return res.status(400).json({
        success: false,
        error: `Cannot cancel request with status: ${request.status}`,
      });
    }

    const cancelled = await requestsService.cancelRequest(id);

    res.json({
      success: true,
      message: 'Request cancelled',
      data: cancelled,
    });
  } catch (error) {
    console.error('Error cancelling request:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  res.status(500).json({
    success: false,
    error: error.message || 'Internal server error',
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Requests Service running on http://localhost:${PORT}`);
  console.log(`📝 Endpoints:`);
  console.log(`   POST /requests - Create new request`);
  console.log(`   GET /requests/my - Get user's requests`);
  console.log(`   GET /requests/history - Get request history`);
  console.log(`   GET /requests/active - Get active requests`);
  console.log(`   GET /requests/:id - Get request details`);
  console.log(`   PUT /requests/:id/status - Update request status`);
  console.log(`   DELETE /requests/:id - Cancel request`);
});
