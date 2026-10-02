---
title: Embedded RTOS Kernel on Custom PCB for Miniature Car
order: 2
image: embedded-pcb.png
alt: PCB design in Fusion
---

- Implemented embedded real-time operating system kernel in team of 2 for [18-349 Introduction to Embedded Systems](https://course.ece.cmu.edu/~ece349/) at CMU.
- Embedded kernel runs on STM32 Cortex M4 on a custom PCB designed in Autodesk Fusion. The kernel runs a PID user program to control and stabilize car motor speed.
- Kernel is written in C and ARM Assembly, and is complete with context switching, mutexes, RMS scheduling, interrupt-based UART, and I2C capability.
