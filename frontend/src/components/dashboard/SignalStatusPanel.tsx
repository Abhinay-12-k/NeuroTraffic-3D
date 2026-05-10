import React from 'react';
import { useGlobalTrafficStore } from '../../store/globalTrafficStore';

const styles = `
  .intersection-wrapper {
    position: relative;
    width: 300px;
    height: 300px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: center;
    perspective: 800px;
  }
  .dashed-ring {
    position: absolute;
    width: 220px;
    height: 220px;
    border: 1px dashed rgba(18, 60, 44, 0.15);
    border-radius: 50%;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 1;
  }
  @keyframes sphere-spin {
    from { transform: rotateY(0deg); }
    to { transform: rotateY(360deg); }
  }
  .center-phase {
    position: absolute;
    width: 80px;
    height: 80px;
    background: #F9F6ED;
    border-radius: 50%;
    box-shadow: 0 10px 20px rgba(18, 60, 44, 0.1), inset 0 2px 5px rgba(255,255,255,1);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    z-index: 10;
    transform-style: preserve-3d;
    border: 1px solid rgba(18, 60, 44, 0.05);
  }
  .phase-text-wrapper {
    animation: sphere-spin 8s linear infinite;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  @keyframes sway {
    0%, 100% { transform: rotateZ(-1deg); }
    50% { transform: rotateZ(1deg); }
  }
  @keyframes pulse-glow {
    0%, 100% { box-shadow: 0 0 15px #00ff88, inset 0 0 5px #00ff88; transform: scale(1); }
    50% { box-shadow: 0 0 25px #00ff88, inset 0 0 10px #00ff88; transform: scale(1.1); }
  }
  .signal-group {
    position: absolute;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    z-index: 20;
    animation: sway 4s ease-in-out infinite;
    transform-origin: center;
  }
  .signal-housing {
    background-color: #123C2C;
    box-shadow: 0 8px 16px rgba(18, 60, 44, 0.2);
    border-radius: 12px;
    padding: 8px;
    display: flex;
    flex-direction: column;
    gap: 6px;
    position: relative;
  }
  .bulb {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background-color: #0b261b;
    transition: background-color 300ms ease, box-shadow 300ms ease;
    box-shadow: inset 0 2px 4px rgba(0,0,0,0.5);
  }
  .bulb.red.active { background-color: #ff3b3b; box-shadow: 0 0 20px rgba(255,59,59,0.8), inset 0 0 8px #ff3b3b; }
  .bulb.yellow.active { background-color: #ffaa00; box-shadow: 0 0 20px rgba(255,170,0,0.8), inset 0 0 8px #ffaa00; }
  .bulb.green.active { background-color: #00ff88; animation: pulse-glow 2s infinite; }
  
  .pos-north { top: -10px; left: 50%; margin-left: -20px; }
  .pos-south { bottom: -10px; left: 50%; margin-left: -20px; }
  .pos-east { right: -5px; top: 50%; margin-top: -45px; }
  .pos-west { left: -5px; top: 50%; margin-top: -45px; }

  .label-text { font-family: 'Inter', sans-serif; font-size: 11px; color: #8B9A93; font-weight: 700; letter-spacing: 1px; }
  .timer-text { font-family: 'Inter', sans-serif; font-size: 14px; font-weight: 700; }
`;

function Signal({ lane, posClass }: { lane: 'NORTH'|'SOUTH'|'EAST'|'WEST', posClass: string }) {
  const signal = useGlobalTrafficStore(s => s.getSignal(lane));
  const timeRemaining = useGlobalTrafficStore(s => s.getSignalTime(lane));
  const isActive = signal === 'GREEN' || signal === 'YELLOW';
  const isSouth = lane === 'SOUTH';

  const Label = <div className="label-text">{lane}</div>;
  const Housing = (
    <div className="signal-housing">
      <div className={`bulb red ${signal === 'RED' ? 'active' : ''}`} />
      <div className={`bulb yellow ${signal === 'YELLOW' ? 'active' : ''}`} />
      <div className={`bulb green ${signal === 'GREEN' ? 'active' : ''}`} />
    </div>
  );
  const Timer = (
    <div className={`timer-text ${isActive ? 'text-green-600' : 'text-gray-400'}`}>
      {timeRemaining}s
    </div>
  );

  return (
    <div className={`signal-group ${posClass}`}>
      {isSouth ? Timer : Label}
      {Housing}
      {isSouth ? Label : Timer}
    </div>
  );
}

export const SignalStatusPanel = () => {
  const phase = useGlobalTrafficStore(s => s.getCurrentPhase());
  const mode = useGlobalTrafficStore(s => s.getMode());

  return (
    <div className="w-full h-full flex flex-col relative overflow-hidden bg-transparent">
      <style>{styles}</style>
      
      <div className="flex-1 w-full h-full flex items-center justify-center mt-4">
        <div className="intersection-wrapper">
          <div className="dashed-ring"></div>
          
          <div className="center-phase">
            <div className="phase-text-wrapper">
              <div className="text-[9px] font-body text-sprint-textMuted uppercase tracking-widest mb-0.5 font-bold">PHASE</div>
              <div className="text-lg font-title italic text-sprint-sidebar font-bold">{phase}</div>
            </div>
          </div>

          <Signal lane="NORTH" posClass="pos-north" />
          <Signal lane="SOUTH" posClass="pos-south" />
          <Signal lane="EAST" posClass="pos-east" />
          <Signal lane="WEST" posClass="pos-west" />
        </div>
      </div>
    </div>
  );
};
