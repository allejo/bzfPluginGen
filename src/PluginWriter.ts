import { CPPClass, CPPFormatter, CPPVisibility } from 'aclovis';

import CallbackChunk from './ChunkWriter/CallbackChunk';
import CleanupChunk from './ChunkWriter/CleanupChunk';
import EventChunk from './ChunkWriter/EventChunk';
import IPlugin from './IPlugin';
import InitChunk from './ChunkWriter/InitChunk';
import MapObjectChunk from './ChunkWriter/MapObjectChunk';
import NameChunk from './ChunkWriter/NameChunk';
import PollTypeChunk from './ChunkWriter/PollTypeChunk';
import SlashCommandChunk from './ChunkWriter/SlashCommandChunk';

export default class PluginWriter {
    private readonly pluginClass: CPPClass;

    constructor(private readonly plugin: IPlugin) {
        this.pluginClass = new CPPClass(this.plugin.name);
        this.pluginClass.addExtends([CPPVisibility.Public, 'bz_Plugin']);

        this.handleNameMethod();
        this.handleInitMethod();
        this.handleCleanupMethod();
        this.handleCallbacks();
        this.handleEvents();
        this.handleSlashCommands();
        this.handleMapObjects();
        this.handlePollTypes();
    }

    getClassName(): string {
        return this.pluginClass.getClassName();
    }

    getFormatter(): CPPFormatter {
        const { codeStyle } = this.plugin;

        return new CPPFormatter({
            bracesOnNewLine: codeStyle.bracesOnNewLine,
            indentWithSpaces: codeStyle.spacingType !== 'tabs',
            indentSpaceCount: codeStyle.spacingType === 'twoSpace' ? 2 : 4,
        });
    }

    write(): string {
        return this.pluginClass.write(this.getFormatter(), 0);
    }

    private handleNameMethod() {
        const nameWriter = new NameChunk(this.pluginClass, this.plugin);
        nameWriter.process();
    }

    private handleInitMethod() {
        const initWriter = new InitChunk(this.pluginClass, this.plugin);
        initWriter.process();
    }

    private handleCleanupMethod() {
        const cleanupWriter = new CleanupChunk(this.pluginClass, this.plugin);
        cleanupWriter.process();
    }

    private handleEvents() {
        const chunkWriter = new EventChunk(this.pluginClass, this.plugin);
        chunkWriter.process();
    }

    private handleSlashCommands() {
        const chunkWriter = new SlashCommandChunk(this.pluginClass, this.plugin);
        chunkWriter.process();
    }

    private handleCallbacks() {
        const callbackChunk = new CallbackChunk(this.pluginClass, this.plugin);
        callbackChunk.process();
    }

    private handleMapObjects() {
        const mapObjectChunk = new MapObjectChunk(this.pluginClass, this.plugin);
        mapObjectChunk.process();
    }

    private handlePollTypes() {
        const pollTypeChunk = new PollTypeChunk(this.pluginClass, this.plugin);
        pollTypeChunk.process();
    }
}
