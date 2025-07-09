const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 400,
    height: 350, // Tăng chiều cao mặc định
    resizable: true, // Cho phép resize cửa sổ
    minWidth: 50, // Thiết lập kích thước tối thiểu
    minHeight: 50,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
    icon: path.join(__dirname, "icon.ico"),
    frame: false, // Ẩn khung cửa sổ (bao gồm thanh tiêu đề và các nút điều khiển)
    titleBarStyle: "hidden", // Ẩn thanh tiêu đề
    skipTaskbar: true, // Ẩn khỏi thanh taskbar
    transparent: true, // Cho phép nền trong suốt
    alwaysOnTop: true, // Luôn hiển thị trên cùng
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

// Xử lý sự kiện từ renderer process
ipcMain.on("show-notification", (event, title, body) => {
  // Hiển thị thông báo khi cần
  mainWindow.flashFrame(true); // Hiệu ứng nhấp nháy
});

// Thêm vào cuối file
ipcMain.on("close-app", () => {
  app.quit();
});

// Xử lý sự kiện kéo cửa sổ
ipcMain.on("drag-window", () => {
  mainWindow.dragMove();
});
