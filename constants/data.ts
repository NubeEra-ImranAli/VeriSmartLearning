export interface Project {
  id: number;
  name: string;
  command: string;
  procedure: string;
}

export interface Grade {
  id: number;
  label: string;
  color: string;
  colorDark: string;
  icon: string;
  projects: Project[];
}

export const grades: Grade[] = [
  {
    id: 1,
    label: 'Grade 1',
    color: '#FF6B6B',
    colorDark: '#CC4444',
    icon: 'flash',
    projects: [
      {
        id: 1,
        name: 'LED ON/OFF using button',
        command: '101',
        procedure: 'This project teaches basic digital control. Press the button to turn the LED ON, and press again to turn it OFF. The microcontroller reads the button input and toggles the LED state accordingly.\n\nComponents: LED, Push Button, Resistor, VeriSmart Board\n\nSteps:\n1. Connect the LED to the output pin\n2. Connect the button to the input pin\n3. Press Execute to start the project\n4. Press the physical button to toggle LED\n5. Press Stop when finished',
      },
      {
        id: 2,
        name: 'Touch-based light control',
        command: '102',
        procedure: 'Control an LED using the touch sensor. When you touch the sensor, the light turns ON. Release to turn it OFF.\n\nComponents: LED, Touch Sensor, VeriSmart Board\n\nSteps:\n1. Connect the LED to the output pin\n2. Connect the touch sensor to the input pin\n3. Press Execute to start the project\n4. Touch the sensor to control the light\n5. Press Stop when finished',
      },
      {
        id: 3,
        name: 'Blinking LED pattern',
        command: '103',
        procedure: 'Create an automatic blinking LED pattern. The LED will blink ON and OFF at regular intervals creating a visual pattern.\n\nComponents: LED, VeriSmart Board\n\nSteps:\n1. Connect the LED to the output pin\n2. Press Execute to start the blinking pattern\n3. Observe the LED blinking at regular intervals\n4. Press Stop when finished',
      },
      {
        id: 4,
        name: 'Automatic night lamp using LDR',
        command: '104',
        procedure: 'Build a smart night lamp that automatically turns ON in darkness and OFF in light using a Light Dependent Resistor (LDR).\n\nComponents: LED, LDR Sensor, VeriSmart Board\n\nSteps:\n1. Connect the LED to the output pin\n2. Connect the LDR sensor to the analog input\n3. Press Execute to start the project\n4. Cover the LDR to simulate darkness - LED turns ON\n5. Expose LDR to light - LED turns OFF\n6. Press Stop when finished',
      },
      {
        id: 5,
        name: 'Touch-based smart buzzer',
        command: '105',
        procedure: 'Activate a buzzer using touch input. Touch the sensor to sound the buzzer, creating a simple interactive alert system.\n\nComponents: Buzzer, Touch Sensor, VeriSmart Board\n\nSteps:\n1. Connect the buzzer to the output pin\n2. Connect the touch sensor to the input pin\n3. Press Execute to start the project\n4. Touch the sensor to activate the buzzer\n5. Press Stop when finished',
      },
      {
        id: 6,
        name: 'Smart doorbell system',
        command: '106',
        procedure: 'Create a smart doorbell that rings when the button is pressed. The buzzer sounds and the LED lights up to indicate someone is at the door.\n\nComponents: Buzzer, LED, Push Button, VeriSmart Board\n\nSteps:\n1. Connect the buzzer and LED to output pins\n2. Connect the push button to the input pin\n3. Press Execute to start the project\n4. Press the button to ring the doorbell\n5. Press Stop when finished',
      },
    ],
  },
  {
    id: 2,
    label: 'Grade 2',
    color: '#4ECDC4',
    colorDark: '#35A89E',
    icon: 'bulb',
    projects: [
      {
        id: 1,
        name: 'Button-controlled LED system',
        command: '201',
        procedure: 'Control multiple LEDs using buttons. Each button controls a different LED, teaching multi-input/output concepts.\n\nComponents: Multiple LEDs, Push Buttons, VeriSmart Board\n\nSteps:\n1. Connect LEDs to output pins\n2. Connect buttons to input pins\n3. Press Execute to start the project\n4. Press different buttons to control different LEDs\n5. Press Stop when finished',
      },
      {
        id: 2,
        name: 'LED pattern controller',
        command: '202',
        procedure: 'Create and control different LED lighting patterns. Switch between patterns using the button input.\n\nComponents: Multiple LEDs, Push Button, VeriSmart Board\n\nSteps:\n1. Connect multiple LEDs to output pins\n2. Connect the button to the input pin\n3. Press Execute to start the project\n4. Press button to cycle through different patterns\n5. Press Stop when finished',
      },
      {
        id: 3,
        name: 'Motor rotation pattern',
        command: '203',
        procedure: 'Control a DC motor to create rotation patterns. The motor spins in different directions and speeds.\n\nComponents: DC Motor, Motor Driver, VeriSmart Board\n\nSteps:\n1. Connect the motor through the motor driver\n2. Press Execute to start the project\n3. Observe motor rotation patterns\n4. Press Stop when finished',
      },
      {
        id: 4,
        name: 'Automatic light using LDR',
        command: '204',
        procedure: 'An advanced automatic lighting system using LDR with brightness adjustment based on ambient light levels.\n\nComponents: LED, LDR Sensor, VeriSmart Board\n\nSteps:\n1. Connect the LED to the output pin\n2. Connect the LDR to the analog input\n3. Press Execute to start the project\n4. Vary the light levels to see LED brightness change\n5. Press Stop when finished',
      },
      {
        id: 5,
        name: 'Touch-based smart alarm',
        command: '205',
        procedure: 'Build a touch-activated alarm system. Touch the sensor to arm/disarm the alarm with visual and audio feedback.\n\nComponents: Buzzer, LED, Touch Sensor, VeriSmart Board\n\nSteps:\n1. Connect buzzer and LED to output pins\n2. Connect touch sensor to input pin\n3. Press Execute to start the project\n4. Touch to arm/disarm the alarm\n5. Press Stop when finished',
      },
      {
        id: 6,
        name: 'Sound-activated alert system',
        command: '206',
        procedure: 'Create an alert system that responds to sound. When sound is detected above a threshold, the alarm activates.\n\nComponents: Sound Sensor, Buzzer, LED, VeriSmart Board\n\nSteps:\n1. Connect buzzer and LED to output pins\n2. Connect sound sensor to input pin\n3. Press Execute to start the project\n4. Make sounds near the sensor to trigger alert\n5. Press Stop when finished',
      },
    ],
  },
  {
    id: 3,
    label: 'Grade 3',
    color: '#FFD93D',
    colorDark: '#CCB030',
    icon: 'hardware-chip',
    projects: [
      {
        id: 1,
        name: 'Timed LED control system',
        command: '301',
        procedure: 'Control LEDs with precise timing. The system uses timers to create complex ON/OFF sequences automatically.\n\nComponents: Multiple LEDs, VeriSmart Board\n\nSteps:\n1. Connect LEDs to output pins\n2. Press Execute to start the project\n3. Observe the timed LED sequences\n4. Press Stop when finished',
      },
      {
        id: 2,
        name: 'Delay-based buzzer system',
        command: '302',
        procedure: 'Create a buzzer system with programmable delays. Generate different tones and rhythms using delay control.\n\nComponents: Buzzer, VeriSmart Board\n\nSteps:\n1. Connect buzzer to output pin\n2. Press Execute to start the project\n3. Listen to the programmed buzzer patterns\n4. Press Stop when finished',
      },
      {
        id: 3,
        name: 'Automatic fan using temperature',
        command: '303',
        procedure: 'Build a smart fan that automatically turns ON when temperature exceeds a threshold and OFF when it cools down.\n\nComponents: Temperature Sensor, DC Motor/Fan, Motor Driver, VeriSmart Board\n\nSteps:\n1. Connect motor through motor driver\n2. Connect temperature sensor to analog input\n3. Press Execute to start the project\n4. Heat the sensor to activate the fan\n5. Press Stop when finished',
      },
      {
        id: 4,
        name: 'Obstacle alert system',
        command: '304',
        procedure: 'Detect obstacles using an ultrasonic sensor and alert with buzzer and LED when an object is too close.\n\nComponents: Ultrasonic Sensor, Buzzer, LED, VeriSmart Board\n\nSteps:\n1. Connect ultrasonic sensor to input pins\n2. Connect buzzer and LED to output pins\n3. Press Execute to start the project\n4. Place objects in front of the sensor\n5. Observe alerts at different distances\n6. Press Stop when finished',
      },
      {
        id: 5,
        name: 'Smart distance warning system',
        command: '305',
        procedure: 'A multi-level distance warning system. Different LEDs and buzzer patterns activate based on how close an object is.\n\nComponents: Ultrasonic Sensor, Multiple LEDs, Buzzer, VeriSmart Board\n\nSteps:\n1. Connect ultrasonic sensor to input pins\n2. Connect LEDs and buzzer to output pins\n3. Press Execute to start the project\n4. Move objects closer/farther to see different warning levels\n5. Press Stop when finished',
      },
      {
        id: 6,
        name: 'Automatic water level alert',
        command: '306',
        procedure: 'Monitor water levels and alert when the level is too high or too low using a water level sensor.\n\nComponents: Water Level Sensor, Buzzer, LEDs, VeriSmart Board\n\nSteps:\n1. Connect water level sensor to analog input\n2. Connect buzzer and LEDs to output pins\n3. Press Execute to start the project\n4. Dip the sensor in water to test levels\n5. Press Stop when finished',
      },
    ],
  },
  {
    id: 4,
    label: 'Grade 4',
    color: '#6C5CE7',
    colorDark: '#5240B8',
    icon: 'rocket',
    projects: [
      {
        id: 1,
        name: 'Multi-input LED system',
        command: '401',
        procedure: 'Advanced LED control using multiple input types (buttons, touch, sensors) to create an interactive lighting system.\n\nComponents: Multiple LEDs, Buttons, Touch Sensor, VeriSmart Board\n\nSteps:\n1. Connect LEDs to output pins\n2. Connect all input devices\n3. Press Execute to start the project\n4. Use different inputs to control LEDs\n5. Press Stop when finished',
      },
      {
        id: 2,
        name: 'Smart control panel',
        command: '402',
        procedure: 'Build a comprehensive control panel that manages multiple outputs (LEDs, buzzer, motor) from a single interface.\n\nComponents: LEDs, Buzzer, Motor, Buttons, VeriSmart Board\n\nSteps:\n1. Connect all output devices\n2. Connect control buttons\n3. Press Execute to start the project\n4. Use the panel to control each device\n5. Press Stop when finished',
      },
      {
        id: 3,
        name: 'Sensor-based smart switch',
        command: '403',
        procedure: 'Create an intelligent switch that uses multiple sensors to determine when to activate/deactivate connected devices.\n\nComponents: LDR, Touch Sensor, LEDs, VeriSmart Board\n\nSteps:\n1. Connect sensors to input pins\n2. Connect output devices\n3. Press Execute to start the project\n4. Test with different sensor combinations\n5. Press Stop when finished',
      },
      {
        id: 4,
        name: 'Smart light + alarm system',
        command: '404',
        procedure: 'An integrated smart home system combining automatic lighting with an alarm. The system responds to light levels and intrusion detection.\n\nComponents: LDR, PIR Sensor, LEDs, Buzzer, VeriSmart Board\n\nSteps:\n1. Connect all sensors and output devices\n2. Press Execute to start the project\n3. Test automatic lighting by covering LDR\n4. Test alarm by triggering motion sensor\n5. Press Stop when finished',
      },
      {
        id: 5,
        name: 'Intelligent alert system',
        command: '405',
        procedure: 'A sophisticated alert system that uses multiple sensors to detect various conditions and provide appropriate alerts.\n\nComponents: Multiple Sensors, Buzzer, LEDs, VeriSmart Board\n\nSteps:\n1. Connect all sensors to input pins\n2. Connect buzzer and LEDs to output pins\n3. Press Execute to start the project\n4. Trigger different sensors to see different alerts\n5. Press Stop when finished',
      },
      {
        id: 6,
        name: 'Smart traffic control system',
        command: '406',
        procedure: 'Simulate a complete traffic light control system with pedestrian crossing, timer display, and emergency vehicle priority.\n\nComponents: Red/Yellow/Green LEDs, Push Button, Buzzer, VeriSmart Board\n\nSteps:\n1. Connect traffic light LEDs (Red, Yellow, Green)\n2. Connect pedestrian button and buzzer\n3. Press Execute to start the project\n4. Observe automatic traffic light sequence\n5. Press pedestrian button to request crossing\n6. Press Stop when finished',
      },
    ],
  },
];

export const STOP_COMMAND = '000';
