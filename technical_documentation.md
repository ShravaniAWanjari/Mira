# Mira Context Engine Technical Documentation

This document explains the technical implementation of **Mira**, including real-time video processing, ambient light detection, and facial feature-based eye strain protection.

---

## 1. Video Stream Management (`getUserMedia`)
The camera feed is initialized via the browser's standard MediaDevices API:
- **Stream Request:** `navigator.mediaDevices.getUserMedia({ video: { width: 320, height: 240 } })`
- **Resolution:** Captured at `320x240` resolution to optimize CPU/GPU processing overhead.
- **Rendering:** Assigned as the source object (`srcObject`) of a standard HTML `<video>` element, styled with CSS (`transform: scaleX(-1)`) to provide a mirrored feed.
- **Processing Loop:** Runs continuously on every frame using `requestAnimationFrame`, which coordinates processing with the browser's repaint cycle.

---

## 2. Ambient Light (Brightness) Detection
Ambient brightness is calculated directly from the video feed using an offscreen canvas:
1. **Frame Capture:** The current frame from the `<video>` is drawn onto a hidden `<canvas>` element at the video's native resolution.
2. **Pixel Sampling:** To minimize performance footprint, we retrieve the canvas image data and sample **every 16th pixel** (stepping `i += 64` in the flat RGBA byte array).
3. **Luminance Formula:** Standard ITU-R BT.601 formula is applied to each sampled pixel:
   $$\text{Luminance} = 0.299 \times R + 0.587 \times G + 0.114 \times B$$
4. **Environment Latching & Debouncing:**
   - **Threshold:** An average luminance of **$< 60$** indicates a dark environment.
   - **Debouncing:** A duration filter of **1000ms** is required before switching states (e.g. from bright to dark, or vice versa) to prevent rapid flickering from noise or movement.

---

## 3. Eye Squint & Strain Detection (MediaPipe)
The system leverages Google **MediaPipe Tasks Vision** (`@mediapipe/tasks-vision`) to locate and track facial landmarks in real time.

### Eye Aspect Ratio (EAR)
To determine if a user is squinting, we compute the **Eye Aspect Ratio (EAR)** for both eyes. EAR measures the ratio of vertical eye openness to horizontal eye width.

For each eye, specific landmarks are selected:
- **Right Eye:**
  - Vertical distance points: `159` to `145`
  - Horizontal distance points: `33` to `133`
- **Left Eye:**
  - Vertical distance points: `386` to `374`
  - Horizontal distance points: `362` to `263`

$$\text{EAR} = \frac{\text{Distance}(\text{Vertical Landmark 1}, \text{Vertical Landmark 2})}{\text{Distance}(\text{Horizontal Landmark 1}, \text{Horizontal Landmark 2})}$$

### Evaluation & Latching Logic
1. **Average EAR:** Evaluated as $(\text{Right EAR} + \text{Left EAR}) / 2.0$.
2. **Threshold:** A threshold of **$< 0.23$** represents a squint.
3. **Trigger Window:** The squint must persist continuously for **3000ms** to trigger the `'strained'` state.
4. **Latching Behavior (Feedback Protection):**
   > [!IMPORTANT]
   > Once `eyeState` transitions to `'strained'`, it does **not** revert back to `'relaxed'` automatically, even when the user stops squinting. 
   > 
   > **Rationale:** When the user squints, the UI adapts by switching to dark mode and dimming media content. This adaptation causes the user's eyes to relax. If the system immediately restored the bright/undimmed state as soon as the eyes relaxed, it would create an infinite feedback loop of eye strain. Hence, the protection remains active.
