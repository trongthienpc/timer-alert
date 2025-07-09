const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  showNotification: (title, body) => ipcRenderer.send('show-notification', title, body),
  closeApp: () => ipcRenderer.send('close-app'),
  resizeWindowCompact: () => ipcRenderer.send('resize-window-compact'),
  resizeWindowNormal: () => ipcRenderer.send('resize-window-normal'),
  getCurrentDate: () => new Date().toISOString() // Thêm hàm lấy ngày hiện tại
});