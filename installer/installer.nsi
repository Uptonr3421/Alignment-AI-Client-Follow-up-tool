; NSIS Installer Script for LGBTQ+ Center Client Follow-Up Automation
; Professional branded installer - no terminal required

!include "MUI2.nsh"
!include "LogicLib.nsh"
!include "FileFunc.nsh"

;--------------------------------
; General Settings
;--------------------------------
Name "LGBTQ Center Automation"
OutFile "LGBTQ-Center-Automation-Setup.exe"
InstallDir "$LOCALAPPDATA\LGBTQCenterAutomation"
InstallDirRegKey HKCU "Software\LGBTQCenterAutomation" "InstallDir"
RequestExecutionLevel user

;--------------------------------
; Version Information
;--------------------------------
VIProductVersion "1.0.0.0"
VIAddVersionKey "ProductName" "LGBTQ Center Client Follow-Up Automation"
VIAddVersionKey "CompanyName" "Alignment AI"
VIAddVersionKey "FileDescription" "Client follow-up automation system for LGBTQ+ centers"
VIAddVersionKey "FileVersion" "1.0.0"
VIAddVersionKey "ProductVersion" "1.0.0"
VIAddVersionKey "LegalCopyright" "© 2026 Alignment AI - MIT License"

;--------------------------------
; MUI Settings (Modern UI)
;--------------------------------
!define MUI_ABORTWARNING

; Check for icon file existence and use if available
!if /FILEEXISTS "assets\icon.ico"
  !define MUI_ICON "assets\icon.ico"
  !define MUI_UNICON "assets\icon.ico"
!endif

; Check for header image and use if available
!if /FILEEXISTS "assets\header.bmp"
  !define MUI_HEADERIMAGE
  !define MUI_HEADERIMAGE_BITMAP "assets\header.bmp"
!endif

; Check for wizard image and use if available
!if /FILEEXISTS "assets\wizard.bmp"
  !define MUI_WELCOMEFINISHPAGE_BITMAP "assets\wizard.bmp"
!endif

; Branding
!define MUI_WELCOMEPAGE_TITLE "Welcome to LGBTQ Center Automation"
!define MUI_WELCOMEPAGE_TEXT "This wizard will guide you through the installation of the Client Follow-Up Automation system.$\r$\n$\r$\nThis software helps nonprofit centers stay connected with clients through automated email follow-ups.$\r$\n$\r$\nClick Next to continue."

!define MUI_FINISHPAGE_TITLE "Installation Complete"
!define MUI_FINISHPAGE_TEXT "LGBTQ Center Automation has been successfully installed.$\r$\n$\r$\nClick Finish to launch the application."
!define MUI_FINISHPAGE_RUN "$INSTDIR\LGBTQ Center Automation.exe"
!define MUI_FINISHPAGE_RUN_TEXT "Launch LGBTQ Center Automation"

;--------------------------------
; Pages
;--------------------------------
!insertmacro MUI_PAGE_WELCOME

; License page - check if LICENSE exists
!if /FILEEXISTS "..\LICENSE"
  !insertmacro MUI_PAGE_LICENSE "..\LICENSE"
!endif

!insertmacro MUI_PAGE_DIRECTORY
!insertmacro MUI_PAGE_COMPONENTS
!insertmacro MUI_PAGE_INSTFILES
!insertmacro MUI_PAGE_FINISH

!insertmacro MUI_UNPAGE_CONFIRM
!insertmacro MUI_UNPAGE_INSTFILES

;--------------------------------
; Languages
;--------------------------------
!insertmacro MUI_LANGUAGE "English"

;--------------------------------
; Sections
;--------------------------------
Section "Application" SecApp
  SectionIn RO
  SetOutPath "$INSTDIR"
  
  ; Main application files - Tauri release build
  ; Check for Tauri build output
  ${If} ${FileExists} "..\src\desktop\src-tauri\target\release\LGBTQ Center Automation.exe"
    File "..\src\desktop\src-tauri\target\release\LGBTQ Center Automation.exe"
  ${ElseIf} ${FileExists} "..\src\desktop\src-tauri\target\release\bundle\msi\*.msi"
    ; If MSI bundle exists, we need to extract or use different approach
    ; For now, copy the entire release folder
    File /r "..\src\desktop\src-tauri\target\release\*.exe"
    File /r "..\src\desktop\src-tauri\target\release\*.dll"
  ${Else}
    ; Fallback: copy all files from release directory if it exists
    ${If} ${FileExists} "..\src\desktop\src-tauri\target\release\*.*"
      File /r "..\src\desktop\src-tauri\target\release\*.*"
    ${EndIf}
  ${EndIf}
  
  ; Create data directory
  CreateDirectory "$INSTDIR\data"
  
  ; Store installation folder
  WriteRegStr HKCU "Software\LGBTQCenterAutomation" "InstallDir" "$INSTDIR"
  
  ; Create uninstaller
  WriteUninstaller "$INSTDIR\Uninstall.exe"
  
  ; Create shortcuts - check if EXE exists first
  ${If} ${FileExists} "$INSTDIR\LGBTQ Center Automation.exe"
    CreateDirectory "$SMPROGRAMS\LGBTQ Center Automation"
    CreateShortcut "$SMPROGRAMS\LGBTQ Center Automation\LGBTQ Center Automation.lnk" "$INSTDIR\LGBTQ Center Automation.exe"
    CreateShortcut "$SMPROGRAMS\LGBTQ Center Automation\Uninstall.lnk" "$INSTDIR\Uninstall.exe"
    CreateShortcut "$DESKTOP\LGBTQ Center Automation.lnk" "$INSTDIR\LGBTQ Center Automation.exe"
    
    ; Register uninstaller in Windows
    WriteRegStr HKCU "Software\Microsoft\Windows\CurrentVersion\Uninstall\LGBTQCenterAutomation" "DisplayName" "LGBTQ Center Automation"
    WriteRegStr HKCU "Software\Microsoft\Windows\CurrentVersion\Uninstall\LGBTQCenterAutomation" "UninstallString" "$\"$INSTDIR\Uninstall.exe$\""
    WriteRegStr HKCU "Software\Microsoft\Windows\CurrentVersion\Uninstall\LGBTQCenterAutomation" "DisplayIcon" "$INSTDIR\LGBTQ Center Automation.exe"
    WriteRegStr HKCU "Software\Microsoft\Windows\CurrentVersion\Uninstall\LGBTQCenterAutomation" "Publisher" "Alignment AI"
    WriteRegStr HKCU "Software\Microsoft\Windows\CurrentVersion\Uninstall\LGBTQCenterAutomation" "DisplayVersion" "1.0.0"
    WriteRegStr HKCU "Software\Microsoft\Windows\CurrentVersion\Uninstall\LGBTQCenterAutomation" "InstallLocation" "$INSTDIR"
    WriteRegStr HKCU "Software\Microsoft\Windows\CurrentVersion\Uninstall\LGBTQCenterAutomation" "HelpLink" "https://alignment-ai.io/support"
    WriteRegStr HKCU "Software\Microsoft\Windows\CurrentVersion\Uninstall\LGBTQCenterAutomation" "URLInfoAbout" "https://alignment-ai.io"
  ${EndIf}
SectionEnd

Section "Desktop Shortcut" SecDesktop
  ${If} ${FileExists} "$INSTDIR\LGBTQ Center Automation.exe"
    CreateShortcut "$DESKTOP\LGBTQ Center Automation.lnk" "$INSTDIR\LGBTQ Center Automation.exe"
  ${EndIf}
SectionEnd

Section "Start Menu Shortcuts" SecStartMenu
  ${If} ${FileExists} "$INSTDIR\LGBTQ Center Automation.exe"
    CreateDirectory "$SMPROGRAMS\LGBTQ Center Automation"
    CreateShortcut "$SMPROGRAMS\LGBTQ Center Automation\LGBTQ Center Automation.lnk" "$INSTDIR\LGBTQ Center Automation.exe"
    ${If} ${FileExists} "$INSTDIR\docs\USER_GUIDE.pdf"
      CreateShortcut "$SMPROGRAMS\LGBTQ Center Automation\User Guide.lnk" "$INSTDIR\docs\USER_GUIDE.pdf"
    ${EndIf}
    CreateShortcut "$SMPROGRAMS\LGBTQ Center Automation\Uninstall.lnk" "$INSTDIR\Uninstall.exe"
  ${EndIf}
SectionEnd

Section "Documentation" SecDocs
  SetOutPath "$INSTDIR\docs"
  ${If} ${FileExists} "docs\USER_GUIDE.md"
    File "docs\USER_GUIDE.md"
  ${EndIf}
  ${If} ${FileExists} "..\docs\USER_GUIDE.md"
    File "..\docs\USER_GUIDE.md"
  ${EndIf}
  ${If} ${FileExists} "..\LICENSE"
    File "..\LICENSE"
  ${EndIf}
SectionEnd

Section "Sample Data" SecSample
  ; Optional sample client data for testing
  SetOutPath "$INSTDIR\data"
  ${If} ${FileExists} "..\docs\sample-clients.csv"
    File "..\docs\sample-clients.csv"
  ${EndIf}
SectionEnd

;--------------------------------
; Descriptions
;--------------------------------
!insertmacro MUI_FUNCTION_DESCRIPTION_BEGIN
  !insertmacro MUI_DESCRIPTION_TEXT ${SecApp} "The main application files required to run the automation system."
  !insertmacro MUI_DESCRIPTION_TEXT ${SecDesktop} "Create a shortcut on the desktop for easy access."
  !insertmacro MUI_DESCRIPTION_TEXT ${SecStartMenu} "Create shortcuts in the Start Menu."
  !insertmacro MUI_DESCRIPTION_TEXT ${SecDocs} "Install user guide and documentation."
  !insertmacro MUI_DESCRIPTION_TEXT ${SecSample} "Install sample client data for testing purposes."
!insertmacro MUI_FUNCTION_DESCRIPTION_END

;--------------------------------
; Uninstaller Section
;--------------------------------
Section "Uninstall"
  ; Remove application files
  RMDir /r "$INSTDIR\*.*"
  RMDir "$INSTDIR"
  
  ; Remove shortcuts
  Delete "$DESKTOP\LGBTQ Center Automation.lnk"
  RMDir /r "$SMPROGRAMS\LGBTQ Center Automation"
  
  ; Remove registry entries
  DeleteRegKey HKCU "Software\LGBTQCenterAutomation"
  DeleteRegKey HKCU "Software\Microsoft\Windows\CurrentVersion\Uninstall\LGBTQCenterAutomation"
  
  ; Show completion message
  MessageBox MB_OK "LGBTQ Center Automation has been completely removed from your computer."
SectionEnd

;--------------------------------
; Custom Functions
;--------------------------------
Function .onInit
  ; Check if already installed
  ReadRegStr $0 HKCU "Software\LGBTQCenterAutomation" "InstallDir"
  ${If} $0 != ""
    MessageBox MB_YESNO "A previous installation of LGBTQ Center Automation was detected.$\r$\n$\r$\nDo you want to remove it before installing the new version?" IDYES uninstall_old IDNO continue_install
    
    uninstall_old:
      ExecWait '$0\Uninstall.exe /S'
      Sleep 2000
    
    continue_install:
  ${EndIf}
FunctionEnd

Function .onInstSuccess
  ; Show completion message
  MessageBox MB_OK "Installation complete!$\r$\n$\r$\nThe LGBTQ Center Automation system is now ready to use.$\r$\n$\r$\nClick the desktop shortcut or find it in your Start Menu to get started."
FunctionEnd

Function .onVerifyInstDir
  ; Prevent installation in system directories
  ${If} $INSTDIR == "C:\\"
    Abort
  ${EndIf}
  ${If} $INSTDIR == "C:\\Windows"
    Abort
  ${EndIf}
  ${If} $INSTDIR == "C:\\Program Files"
    Abort
  ${EndIf}
  ${If} $INSTDIR == "C:\\Program Files (x86)"
    Abort
  ${EndIf}
FunctionEnd
