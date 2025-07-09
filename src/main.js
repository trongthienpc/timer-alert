const { app, BrowserWindow, ipcMain, Notification } = require("electron");
const path = require("path");

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 400,
    height: 400,
    resizable: true,
    minWidth: 50,
    minHeight: 100,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: false,
      contextIsolation: true,
    },
    icon: path.join(__dirname, "../assets/icon.ico"),
    frame: false,
    titleBarStyle: "hidden",
    skipTaskbar: true,
    transparent: true,
    alwaysOnTop: true,
  });

  mainWindow.loadFile(path.join(__dirname, "renderer/index.html"));
  mainWindow.setMenu(null);

  // Mở DevTools khi phát triển
  // mainWindow.webContents.openDevTools();

  mainWindow.on("closed", function () {
    mainWindow = null;
  });
}

app.whenReady().then(createWindow);

app.on("window-all-closed", function () {
  if (process.platform !== "darwin") app.quit();
});

app.on("activate", function () {
  if (mainWindow === null) createWindow();
});

// Xử lý thông báo
ipcMain.on("show-notification", (event, title, body) => {
  if (mainWindow) {
    mainWindow.flashFrame(true);

    // Tạo thông báo hệ thống (tùy chọn)
    if (Notification.isSupported()) {
      new Notification({
        title: title,
        body: body,
        silent: false,
      }).show();
    }
  }
});

// Đóng ứng dụng
ipcMain.on("close-app", () => {
  app.quit();
});

// Thay đổi kích thước cửa sổ khi timer chạy
ipcMain.on("resize-window-compact", () => {
  if (mainWindow) {
    mainWindow.setSize(300, 50); // Kích thước nhỏ cho timer - đồng bộ với CSS
    mainWindow.center(); // Căn giữa lại
  }
});

// Khôi phục kích thước cửa sổ bình thường
ipcMain.on("resize-window-normal", () => {
  if (mainWindow) {
    mainWindow.setSize(400, 400); // Kích thước ban đầu - đồng bộ với createWindow
    mainWindow.center(); // Căn giữa lại
  }
});
