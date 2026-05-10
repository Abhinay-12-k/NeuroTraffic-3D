const { buildGlobalState, triggerEmergency, clearEmergency, startSimulation } = require('../services/trafficSimulator');

module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log('✅ Client connected:', socket.id);
    
    // Immediately emit current state to new client
    socket.emit('state:sync', buildGlobalState());
    socket.emit('connection:confirmed', { status: 'online' });

    socket.on('emergency:trigger', ({ lane }) => {
      console.log(`🚨 Emergency triggered on lane: ${lane}`);
      triggerEmergency(lane);
      io.emit('emergency:alert', { lane, message: `Emergency vehicle on ${lane} — corridor activated` });
    });

    socket.on('emergency:manual-trigger', ({ lane }) => {
      console.log(`🚨 Manual Emergency triggered on lane: ${lane}`);
      triggerEmergency(lane);
      io.emit('emergency:alert', { lane, message: `Manual emergency override on ${lane}` });
    });

    socket.on('emergency:clear', () => {
      console.log('✅ Emergency cleared');
      clearEmergency();
      io.emit('emergency:cleared');
    });

    socket.on('copilot:query', async ({ query }) => {
      console.log(`🤖 AI Copilot Query: ${query}`);
      const { generateCopilotResponse } = require('../services/aiCopilotService');
      const { triggerEmergency, triggerVipCorridor, clearEmergency, clearVipCorridor, getCurrentState } = require('../services/trafficSimulator');
      
      const currentState = getCurrentState();
      const result = await generateCopilotResponse(query, currentState);
      
      // Execute any commands the AI decided
      if (result.command) {
        console.log(`🤖 AI Executing Command:`, result.command);
        if (result.command.type === 'TRIGGER_AMBULANCE') {
          triggerEmergency(result.command.lane || 'NORTH');
        } else if (result.command.type === 'TRIGGER_VIP_ALPHA') {
          triggerVipCorridor('ALPHA');
        } else if (result.command.type === 'TRIGGER_VIP_BETA') {
          triggerVipCorridor('BETA');
        } else if (result.command.type === 'CLEAR_EMERGENCY') {
          clearEmergency();
          clearVipCorridor('ALPHA');
          clearVipCorridor('BETA');
        }
      }
      
      socket.emit('copilot:response', { response: result.response });
    });

    socket.on('emergency:vip-trigger', ({ route }) => {
      console.log(`🚨 VIP Corridor activated for route: ${route}`);
      const { triggerVipCorridor } = require('../services/trafficSimulator');
      triggerVipCorridor(route);
      io.emit('emergency:alert', { lane: route, message: `VIP Corridor active on ${route}` });
    });

    socket.on('emergency:vip-clear', ({ route }) => {
      console.log(`✅ VIP Corridor cleared for route: ${route}`);
      const { clearVipCorridor } = require('../services/trafficSimulator');
      clearVipCorridor(route);
      io.emit('emergency:cleared');
    });

    socket.on('disconnect', (reason) => {
      console.log(`❌ Client disconnected: ${socket.id} (${reason})`);
    });
  });

  // Begin the simulation loop
  startSimulation(io);
  console.log('🚀 Traffic Simulation Engine started');
};
