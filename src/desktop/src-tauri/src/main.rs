// Cleveland LGBTQ Center Client Follow-Up Automation - Desktop Backend
// 
// This is the Rust backend for the Tauri desktop application.
// It handles database operations, email sending, and system integration.

#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use tauri::Manager;

// Tauri commands (API endpoints for the frontend)

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! Welcome to Cleveland LGBTQ Center Automation.", name)
}

// TODO: Implement additional commands for:
// - Client management (CRUD operations)
// - Email template management
// - Email queue and sending
// - Settings management
// - Database operations

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![greet])
        .setup(|app| {
            #[cfg(debug_assertions)]
            {
                let window = app.get_window("main").unwrap();
                window.open_devtools();
            }
            
            println!("╔════════════════════════════════════════════════════════════════╗");
            println!("║  Cleveland LGBTQ Center Client Follow-Up Automation           ║");
            println!("║  Desktop Application                                           ║");
            println!("║                                                                ║");
            println!("║  Built with ❤️  by Alignment AI                                ║");
            println!("╚════════════════════════════════════════════════════════════════╝");
            
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
