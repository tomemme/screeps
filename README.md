# Screeps AI - Room Management and Creep Automation

Welcome to my **Screeps** AI repository! This project focuses on automating room management, resource gathering, structure building, and defense strategies for the real-time strategy game Screeps. The code is designed to optimize resource management, ensure efficient creep behavior, and manage multiple tasks like upgrading, building, repairing, and defending your room(s).

## Features

### 🛠️ **Creep Automation**
- **Harvesters**: Automatically gather energy from sources and deliver it to spawns, extensions, towers, or storage. If no energy is needed, they fallback to upgrading the controller.
- **Builders**: Construct structures based on available construction sites. If there are no building tasks, they also help upgrade the controller.
- **Upgraders**: Dedicated to upgrading the room controller to increase room capabilities.
- **Repairers**: Maintain walls and ramparts, ensuring they are kept above a critical hit point threshold.
- **Defenders**: Protect the room by attacking hostile creeps and assisting in defending the room using towers.

### 🏗️ **Room Management**
- **Task Manager**: Dynamically assigns tasks to creeps based on their role, room needs, and energy availability.
- **Energy Management**: Optimizes energy flow from sources to structures like spawns, extensions, and towers. When those are full, excess energy is deposited into storage or used to upgrade the controller.
- **Automatic Expansion**: As room controllers level up, the system begins looking for nearby neutral rooms to claim using claimer creeps (triggered at controller level 4+).

### 🛡️ **Defense System**
- **Tower Management**: Towers prioritize attacking hostile creeps and will repair walls or ramparts when there are no threats.
- **Creep Defenders**: When enemies are detected, the program spawns defenders to attack hostiles and protect the room.

### 💬 **Visual Feedback**
- **Emoji Creep Communication**: Creeps use `say()` to indicate their current task:
  - ⛏️ for **harvesting**
  - ⚡ for **upgrading**
  - 🚧 for **building**
  - 🛠️ for **repairing**
  - ⚔️ for **attacking**

- **Visual Path Styles**: Each role has a different path color to indicate what task they're performing.

## How It Works

1. **Room Startup**: 
   - The program begins by spawning essential creeps (harvesters, builders, and upgraders). These creeps gather energy and distribute it efficiently to ensure continuous room growth.
   
2. **Task Assignment**: 
   - The `taskManager` dynamically assigns tasks to creeps based on room needs, ensuring that energy is gathered and used efficiently.

3. **Controller Upgrade**: 
   - Creeps focus on upgrading the controller to unlock new structures and increase room capabilities.

4. **Defense and Expansion**: 
   - Defenders and towers protect the room from enemies, while the expansion manager looks for new rooms to claim after reaching controller level 4.

## How to Use

### Requirements
- **Screeps Account**: You need a Screeps account to run this code on the official Screeps server.
- **JavaScript ES6+**: The code is written in ES6 JavaScript and runs on the Screeps server.

### Installation

1. Clone the repository to your local machine:
    ```bash
    git clone https://github.com/your-username/screeps-ai.git
    ```

2. Set up your Screeps environment (via **Screeps Web IDE** or a **3rd party client** like **ScreepsPlus**).

3. Upload the code files into your Screeps account.

4. Deploy the code to start managing your room(s) automatically!

## Project Structure

```bash
screeps-ai/
├── main.js               # Main loop where all room and creep logic is executed
├── taskManager.js        # Assigns tasks dynamically based on room needs and creep roles
├── creepFactory.js       # Handles the creation and spawning of new creeps
├── roomManager.js        # Oversees all room operations like energy management and structure building
├── defenseManager.js     # Manages towers, defenses, and creep defenders
├── expansionManager.js   # Handles room expansion once a room's controller reaches level 4+
├── role.harvester.js     # Harvester creep behavior (part of taskManager)
├── role.builder.js       # Builder creep behavior (part of taskManager)
├── role.upgrader.js      # Upgrader creep behavior (part of taskManager)
├── role.repairer.js      # Repairer creep behavior (part of taskManager)
