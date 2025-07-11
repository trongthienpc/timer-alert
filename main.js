const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 400,
    height: 400,
    resizable: true,
    minWidth: 50,
    minHeight: 50,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
    icon: path.join(__dirname, "icon.ico"),
    frame: false,
    titleBarStyle: "hidden",
    skipTaskbar: true,
    transparent: true,
    alwaysOnTop: true,
  });

  mainWindow.loadFile("index.html");
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
    const { Notification } = require("electron");
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
    mainWindow.setSize(300, 50); // Kích thước nhỏ cho timer
    mainWindow.center(); // Căn giữa lại
  }
});

// Khôi phục kích thước cửa sổ bình thường
ipcMain.on("resize-window-normal", () => {
  if (mainWindow) {
    mainWindow.setSize(400, 350); // Kích thước ban đầu
    mainWindow.center(); // Căn giữa lại
  }
});

// Xử lý kéo cửa sổ - FIXED
// Không cần xử lý drag-window trong main process
// Vì đã sử dụng CSS -webkit-app-region: drag
