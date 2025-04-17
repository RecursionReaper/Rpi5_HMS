# 🏠 Home Surveillance System using Raspberry Pi 5 & Next.js

## 📖 Overview
The **Home Surveillance System** is a robust, customizable security solution built on the power of the **Raspberry Pi 5** and a modern web interface using **Next.js**. Designed for real-time video streaming, motion detection, object recognition, and intelligent notifications, this project offers a complete surveillance solution that is both affordable and flexible.

The Raspberry Pi 5 serves as the core processing unit, handling hardware interactions, camera feed processing, and motion detection. The frontend, built with Next.js, provides an intuitive, responsive interface for users to monitor live streams, view snapshots, and receive alerts. By leveraging **YOLO Nano** for object detection, the system achieves high-speed recognition with low computational overhead, making it ideal for an edge device like the Raspberry Pi.

This project aims to deliver an efficient and user-friendly platform suitable for various use cases, including home monitoring, package delivery notifications, and pet activity tracking.

---

## 🧰 Hardware & Software Components
### 🔌 Hardware Components
| Component                  | Quantity | Description                                      |
|---------------------------|----------|--------------------------------------------------|
| Raspberry Pi 5            | 1        | Main processing unit for running the system     |
| Raspberry Pi Camera Module 3 | 1     | Captures high-quality video for live streaming   |
| PIR Motion Sensor         | 1        | Detects motion and triggers snapshot capture     |
| MicroSD Card (32GB/64GB)  | 1        | Stores OS, project files, and snapshots          |
| Power Supply              | 1        | Powers the Raspberry Pi                          |
| Ethernet Cable/Wi-Fi      | 1        | Provides network connectivity                    |
| Jumper Wires & Breadboard | As needed| For connecting sensors to the Raspberry Pi      |

### 🖥️ Software Stack
- **Raspberry Pi OS (Lite)**: Lightweight operating system for efficient processing.
- **Next.js**: Provides server-side rendering and a responsive web interface.
- **nginx**: Serves the Next.js application locally on the Raspberry Pi.
- **YOLO Nano**: Lightweight object detection model optimized for edge devices.
- **Python**: Handles hardware interfacing, motion detection, and object recognition.
- **Tailwind CSS**: Ensures a modern, responsive UI design.

---

## 🏗️ Project Structure Overview
The project architecture separates hardware processing from the web interface, ensuring modularity and maintainability. The **Raspberry Pi** handles sensor input, camera feed processing, and object detection, while **Next.js** provides a seamless user experience through a local web server.

### 📂 Folder Structure
```
home-surveillance-nextjs/
├── components/        # Reusable React components for the UI
│   ├── Navbar.js      # Navigation bar across pages
│   ├── LiveStream.js  # Displays the real-time video feed
│   └── SnapshotGallery.js # Renders captured images
├── pages/             # Next.js pages with automatic routing
│   ├── index.js       # Homepage with live camera feed
│   ├── snapshots.js   # Gallery of motion-triggered snapshots
│   └── api/           # Backend API routes for handling logic
│       ├── motionDetection.js  # Triggers and processes motion events
│       ├── emailAlert.js       # Sends email notifications with snapshots
│       └── objectDetection.js  # Interfaces with YOLO Nano for object recognition
├── public/            # Publicly accessible static files
│   └── snapshots/     # Stored images captured during motion detection
├── scripts/           # Python scripts for hardware interfacing
│   ├── motion_detection.py  # Reads PIR sensor input and captures images
│   ├── email_alert.py       # Sends email notifications with attachments
│   └── object_detection.py  # Runs YOLO Nano for object recognition
├── styles/            # Styling files using Tailwind CSS
├── nginx_config/      # Configuration files for the nginx server
├── README.md          # Project documentation
├── next.config.js     # Next.js configuration settings
└── tailwind.config.js # Tailwind CSS configuration
```

### 📄 Key Files Explained
- **components/**: Houses UI elements like the live stream player and snapshot gallery.
- **pages/**: Contains web pages for live feed viewing and snapshot history.
- **api/**: Facilitates communication between the frontend and backend processes.
- **scripts/**: Python scripts that interact with hardware components and handle real-time processing.
- **public/snapshots/**: Stores images accessible via the website.

---

## 🔍 Feature Details
### 📺 Live Camera Streaming  
- Utilizes the **Raspberry Pi Camera Module 3** to provide a continuous video feed.
- Streams are processed using **ffmpeg** and displayed via the Next.js interface.
- Accessible through a local web address (e.g., `http://<raspberry_pi_ip>`).

### 🕵️ Motion Detection with PIR Sensor  
- **PIR Motion Sensor** detects movement within its field of view.
- Upon detection:
  - A snapshot is captured and stored in the `public/snapshots/` directory.
  - The snapshot is immediately displayed on the "Snapshots" page.
  - An email alert with the image attachment is sent to the user.

### 🧠 Object Detection using YOLO Nano  
- **YOLO Nano** is integrated for real-time object detection with minimal latency.
- Suitable for detecting objects like packages, people, and pets.
- Detected objects are displayed as captions in the terminal and web interface.
- Scenario-based alerts (e.g., "Amazon package detected") are triggered for specific object classes.

### 📧 Email Notifications  
- **Email alerts** are sent using Python's `smtplib` library.
- Notifications include:
  - Subject line indicating the event (e.g., "Motion Detected at Front Door").
  - Body text with timestamp and event details.
  - Attached snapshot image for visual confirmation.

---

## 💡 Why Raspberry Pi 5 and YOLO Nano?
### 🌱 Raspberry Pi 5 Advantages:
- Faster processing speed suitable for handling real-time video streams.
- Multiple USB and GPIO ports for sensor integration.
- Compact size ideal for discrete installations.

### ⚡ YOLO Nano Benefits:
- **Lightweight:** Optimized for devices with limited computational resources.
- **Fast Inference:** Ensures quick detection without lag.
- **High Accuracy:** Reliable object recognition even on a compact edge device.

---

## 🧪 Applications
- 🏠 **Home Security:** Monitor entrances, rooms, and outdoor spaces.
- 📦 **Package Detection:** Receive alerts when deliveries arrive.
- 🐕 **Pet Monitoring:** Track pet movements and activity.
- 🚪 **Smart Doorbell:** Identify visitors with real-time notifications.

---

## 🙌 Contributors
- [Aniket Desai](https://github.com/RecursionReaper)  
- [Yash Ogale](https://github.com/yashogale30)

## 📝 License
This project is licensed under the MIT License.

---

🚀 **Stay secure, stay informed!** 🔒
