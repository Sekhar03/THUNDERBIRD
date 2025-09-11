
## Scenario Mode
Scenario Mode simulates end-to-end operational events to stress and demonstrate the system.

### What it simulates
- Hacker Attempt: Unauthorized access and threat mitigation.
- Quantum Authentication: Key regeneration and authentication workflow.
- Satellite Failure: Link loss and recovery handling.
- Quantum Security Breach: Key compromise and regeneration response.
- Network Overload: High-traffic load balancing and resilience.

### How to use
- In the UI: toggle to Scenario Mode from the mode switch on the home page.
- Voice control: say "Switch to scenario mode".
- API: POST http://localhost:8080/api/mode with { "mode": "scenario" }.

### What youll see
- Current scenario name and elapsed time.
- Per-scenario status: pending  active  completed.
- System indicators (performance, security, network) updating over time.

### Tips
- You can pause/play the 3D visualization and inspect individual satellites.
- Use the AI Threat Detection panel to observe simulated detections.
- Return to Real-time Mode anytime via the toggle or voice command.
