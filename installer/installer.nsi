; NSIS Installer Script for Cleveland LGBTQ Center Client Follow-Up Automation
; 
; This creates a professional Windows installer for the desktop application.
; Brand colors and messaging reflect the Center's identity.

!define PRODUCT_NAME "Cleveland LGBTQ Center Automation"
!define PRODUCT_VERSION "1.0.0"
!define PRODUCT_PUBLISHER "Alignment AI"
!define PRODUCT_WEB_SITE "https://alignment-ai.io"
!define PRODUCT_DIR_REGKEY "Software\Microsoft\Windows\CurrentVersion\App Paths\lgbtq-center-automation.exe"
!define PRODUCT_UNINST_KEY "Software\Microsoft\Windows\CurrentVersion\Uninstall\${PRODUCT_NAME}"
!define PRODUCT_UNINST_ROOT_KEY "HKLM"

; Colors (Cleveland LGBTQ Center brand)
!define MUI_BGCOLOR "E6511A" ; Orange
!define MUI_TEXTCOLOR "252422" ; Charcoal

; MUI Settings
!include "MUI2.nsh"

!define MUI_ABORTWARNING
!define MUI_ICON "..\assets\icon.ico"
!define MUI_UNICON "..\assets\icon.ico"

; Welcome page
!insertmacro MUI_PAGE_WELCOME
; License page
!insertmacro MUI_PAGE_LICENSE "..\LICENSE"
; Directory page
!insertmacro MUI_PAGE_DIRECTORY
; Instfiles page
!insertmacro MUI_PAGE_INSTFILES
; Finish page
!define MUI_FINISHPAGE_RUN "$INSTDIR\lgbtq-center-automation.exe"
!insertmacro MUI_PAGE_FINISH

; Uninstaller pages
!insertmacro MUI_UNPAGE_INSTFILES

; Language files
!insertmacro MUI_LANGUAGE "English"

Name "${PRODUCT_NAME} ${PRODUCT_VERSION}"
OutFile "lgbtq-center-automation-${PRODUCT_VERSION}-setup.exe"
InstallDir "$PROGRAMFILES\Cleveland LGBTQ Center Automation"
InstallDirRegKey HKLM "${PRODUCT_DIR_REGKEY}" ""
ShowInstDetails show
ShowUnInstDetails show

Section "MainSection" SEC01
  SetOutPath "$INSTDIR"
  SetOverwrite ifnewer
  
  ; Copy application files
  File /r "..\src\desktop\src-tauri\target\release\*.*"
  
  ; Create shortcuts
  CreateDirectory "$SMPROGRAMS\Cleveland LGBTQ Center Automation"
  CreateShortCut "$SMPROGRAMS\Cleveland LGBTQ Center Automation\Cleveland LGBTQ Center Automation.lnk" "$INSTDIR\lgbtq-center-automation.exe"
  CreateShortCut "$DESKTOP\Cleveland LGBTQ Center Automation.lnk" "$INSTDIR\lgbtq-center-automation.exe"
  
  ; Write registry keys
  WriteRegStr HKLM "${PRODUCT_DIR_REGKEY}" "" "$INSTDIR\lgbtq-center-automation.exe"
  WriteRegStr ${PRODUCT_UNINST_ROOT_KEY} "${PRODUCT_UNINST_KEY}" "DisplayName" "$(^Name)"
  WriteRegStr ${PRODUCT_UNINST_ROOT_KEY} "${PRODUCT_UNINST_KEY}" "UninstallString" "$INSTDIR\uninst.exe"
  WriteRegStr ${PRODUCT_UNINST_ROOT_KEY} "${PRODUCT_UNINST_KEY}" "DisplayIcon" "$INSTDIR\lgbtq-center-automation.exe"
  WriteRegStr ${PRODUCT_UNINST_ROOT_KEY} "${PRODUCT_UNINST_KEY}" "DisplayVersion" "${PRODUCT_VERSION}"
  WriteRegStr ${PRODUCT_UNINST_ROOT_KEY} "${PRODUCT_UNINST_KEY}" "URLInfoAbout" "${PRODUCT_WEB_SITE}"
  WriteRegStr ${PRODUCT_UNINST_ROOT_KEY} "${PRODUCT_UNINST_KEY}" "Publisher" "${PRODUCT_PUBLISHER}"
SectionEnd

Section -Post
  WriteUninstaller "$INSTDIR\uninst.exe"
SectionEnd

Section Uninstall
  Delete "$INSTDIR\uninst.exe"
  Delete "$INSTDIR\*.*"
  
  Delete "$SMPROGRAMS\Cleveland LGBTQ Center Automation\Cleveland LGBTQ Center Automation.lnk"
  Delete "$DESKTOP\Cleveland LGBTQ Center Automation.lnk"
  
  RMDir "$SMPROGRAMS\Cleveland LGBTQ Center Automation"
  RMDir "$INSTDIR"
  
  DeleteRegKey ${PRODUCT_UNINST_ROOT_KEY} "${PRODUCT_UNINST_KEY}"
  DeleteRegKey HKLM "${PRODUCT_DIR_REGKEY}"
  SetAutoClose true
SectionEnd
