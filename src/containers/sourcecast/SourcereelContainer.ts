import { connect, MapDispatchToProps, MapStateToProps } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';

import {
  beginDebuggerPause,
  beginInterruptExecution,
  browseReplHistoryDown,
  browseReplHistoryUp,
  changeEditorHeight,
  changeEditorWidth,
  changeSideContentHeight,
  chapterSelect,
  clearReplOutput,
  debuggerReset,
  debuggerResume,
  deleteSourcecastEntry,
  evalEditor,
  evalRepl,
  externalLibrarySelect,
  fetchSourcecastIndex,
  navigateToDeclaration,
  promptAutocomplete,
  recordInit,
  recordInput,
  resetInputs,
  saveSourcecastData,
  setCodeDeltasToApply,
  setCurrentPlayerTime,
  setEditorBreakpoint,
  setEditorReadonly,
  setInputToApply,
  setSourcecastData,
  setSourcecastDuration,
  setSourcecastStatus,
  timerPause,
  timerReset,
  timerResume,
  timerStart,
  timerStop,
  toggleEditorAutorun,
  updateActiveTab,
  updateEditorValue,
  updateReplValue,
  WorkspaceLocation
} from '../../actions';
import { ExternalLibraryName } from '../../components/assessment/assessmentShape';
import {
  ICodeDelta,
  Input,
  IPlaybackData,
  IPosition,
  PlaybackStatus
} from '../../components/sourcecast/sourcecastShape';
import Sourcereel, { IDispatchProps, IStateProps } from '../../components/sourcecast/Sourcereel';
import { IState, SideContentType } from '../../reducers/states';

const mapStateToProps: MapStateToProps<IStateProps, {}, IState> = state => ({
  audioUrl: state.workspaces.sourcecast.audioUrl,
  currentPlayerTime: state.workspaces.sourcecast.currentPlayerTime,
  codeDeltasToApply: state.workspaces.sourcecast.codeDeltasToApply,
  breakpoints: state.workspaces.sourcereel.breakpoints,
  editorReadonly: state.workspaces.sourcereel.editorReadonly,
  editorValue: state.workspaces.sourcereel.editorValue!,
  editorWidth: state.workspaces.sourcereel.editorWidth,
  enableDebugging: state.workspaces.sourcereel.enableDebugging,
  externalLibraryName: state.workspaces.sourcereel.externalLibrary,
  highlightedLines: state.workspaces.sourcereel.highlightedLines,
  inputToApply: state.workspaces.sourcecast.inputToApply,
  isDebugging: state.workspaces.sourcereel.isDebugging,
  isEditorAutorun: state.workspaces.sourcereel.isEditorAutorun,
  isRunning: state.workspaces.sourcereel.isRunning,
  newCursorPosition: state.workspaces.sourcereel.newCursorPosition,
  output: state.workspaces.sourcereel.output,
  playbackData: state.workspaces.sourcereel.playbackData,
  playbackDuration: state.workspaces.sourcecast.playbackDuration,
  playbackStatus: state.workspaces.sourcecast.playbackStatus,
  recordingStatus: state.workspaces.sourcereel.recordingStatus,
  replValue: state.workspaces.sourcereel.replValue,
  sideContentHeight: state.workspaces.sourcereel.sideContentHeight,
  sourcecastIndex: state.workspaces.sourcecast.sourcecastIndex,
  sourceChapter: state.workspaces.sourcereel.context.chapter,
  sourceVariant: state.workspaces.sourcereel.context.variant,
  timeElapsedBeforePause: state.workspaces.sourcereel.timeElapsedBeforePause,
  timeResumed: state.workspaces.sourcereel.timeResumed
});

const location: WorkspaceLocation = 'sourcereel';

const mapDispatchToProps: MapDispatchToProps<IDispatchProps, {}> = (dispatch: Dispatch) =>
  bindActionCreators(
    {
      handleActiveTabChange: (activeTab: SideContentType) => updateActiveTab(activeTab, location),
      handleBrowseHistoryDown: () => browseReplHistoryDown(location),
      handleBrowseHistoryUp: () => browseReplHistoryUp(location),
      handleChapterSelect: (chapter: number) => chapterSelect(chapter, 'default', location),
      handleDeclarationNavigate: (cursorPosition: IPosition) =>
        navigateToDeclaration(location, cursorPosition),
      handleDeleteSourcecastEntry: (id: number) => deleteSourcecastEntry(id, 'sourcecast'),
      handleEditorEval: () => evalEditor(location),
      handleEditorValueChange: (val: string) => updateEditorValue(val, location),
      handleEditorHeightChange: (height: number) => changeEditorHeight(height, location),
      handleEditorWidthChange: (widthChange: number) =>
        changeEditorWidth(widthChange.toString(), location),
      handleEditorUpdateBreakpoints: (breakpoints: string[]) =>
        setEditorBreakpoint(breakpoints, location),
      handleExternalSelect: (externalLibraryName: ExternalLibraryName) =>
        externalLibrarySelect(externalLibraryName, location),
      handleFetchSourcecastIndex: () => fetchSourcecastIndex('sourcecast'),
      handleInterruptEval: () => beginInterruptExecution(location),
      handleRecordInput: (input: Input) => recordInput(input, location),
      handleReplEval: () => evalRepl(location),
      handleReplOutputClear: () => clearReplOutput(location),
      handleReplValueChange: (newValue: string) => updateReplValue(newValue, location),
      handleSaveSourcecastData: (
        title: string,
        description: string,
        audio: Blob,
        playbackData: IPlaybackData
      ) => saveSourcecastData(title, description, audio, playbackData, 'sourcecast'),
      handleSetCurrentPlayerTime: (playerTime: number) =>
        setCurrentPlayerTime(playerTime, 'sourcecast'),
      handleSetCodeDeltasToApply: (deltas: ICodeDelta[]) =>
        setCodeDeltasToApply(deltas, 'sourcecast'),
      handleSetInputToApply: (inputToApply: Input) => setInputToApply(inputToApply, 'sourcecast'),
      handleSetSourcecastData: (
        title: string,
        description: string,
        audioUrl: string,
        playbackData: IPlaybackData
      ) => setSourcecastData(title, description, audioUrl, playbackData, 'sourcecast'),
      handleSetSourcecastDuration: (duration: number) =>
        setSourcecastDuration(duration, 'sourcecast'),
      handleSetSourcecastStatus: (playbackStatus: PlaybackStatus) =>
        setSourcecastStatus(playbackStatus, 'sourcecast'),
      handleSetEditorReadonly: (readonly: boolean) => setEditorReadonly(location, readonly),
      handleResetInputs: (inputs: Input[]) => resetInputs(inputs, location),
      handleRecordInit: (initData: IPlaybackData['init']) => recordInit(initData, location),
      handleSideContentHeightChange: (heightChange: number) =>
        changeSideContentHeight(heightChange, location),
      handleTimerPause: () => timerPause(location),
      handleTimerReset: () => timerReset(location),
      handleTimerResume: (timeBefore: number) => timerResume(timeBefore, location),
      handleTimerStart: () => timerStart(location),
      handleTimerStop: () => timerStop(location),
      handleToggleEditorAutorun: () => toggleEditorAutorun(location),
      handleDebuggerPause: () => beginDebuggerPause(location),
      handleDebuggerResume: () => debuggerResume(location),
      handleDebuggerReset: () => debuggerReset(location),
      handlePromptAutocomplete: (row: number, col: number, callback: any) =>
        promptAutocomplete(location, row, col, callback)
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Sourcereel);
