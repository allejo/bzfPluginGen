import { CPPClass, CPPFormatter, CPPVisibility } from 'aclovis';

import CallbackChunk from './ChunkWriter/CallbackChunk';
import { ChunkWriter } from './ChunkWriter/ChunkWriter';
import CleanupChunk from './ChunkWriter/CleanupChunk';
import EventChunk from './ChunkWriter/EventChunk';
import IPlugin from './IPlugin';
import InitChunk from './ChunkWriter/InitChunk';
import MapObjectChunk from './ChunkWriter/MapObjectChunk';
import NameChunk from './ChunkWriter/NameChunk';
import PollTypeChunk from './ChunkWriter/PollTypeChunk';
import SlashCommandChunk from './ChunkWriter/SlashCommandChunk';

/**
 * @since 1.0.0
 */
export default class PluginWriter {
    private readonly pluginClass: CPPClass;
    private readonly chunkWriters: ChunkWriter[];

    public constructor(private readonly plugin: IPlugin) {
        this.pluginClass = new CPPClass(this.plugin.name);
        this.pluginClass.addExtends([CPPVisibility.Public, 'bz_Plugin']);

        this.chunkWriters = [
            new NameChunk(this.pluginClass, this.plugin),
            new InitChunk(this.pluginClass, this.plugin),
            new CleanupChunk(this.pluginClass, this.plugin),
            new CallbackChunk(this.pluginClass, this.plugin),
            new EventChunk(this.pluginClass, this.plugin),
            new SlashCommandChunk(this.pluginClass, this.plugin),
            new MapObjectChunk(this.pluginClass, this.plugin),
            new PollTypeChunk(this.pluginClass, this.plugin),
        ];

        this.chunkWriters.forEach((writer: ChunkWriter) => {
            writer.process();
        });
    }

    /**
     * Get all of the additional classes that registered ChunkWriters may have
     * created.
     *
     * @since 1.0.3
     */
    public getAdditionalClasses(): CPPClass[] {
        return this.flatten(this.chunkWriters.map(writer => writer.getAdditionalClasses()));
    }

    /**
     * @since 1.0.0
     */
    public getClassName(): string {
        return this.pluginClass.getClassName();
    }

    /**
     * @since 1.0.0
     */
    public getFormatter(): CPPFormatter {
        const { codeStyle } = this.plugin;

        return new CPPFormatter({
            bracesOnNewLine: codeStyle.bracesOnNewLine,
            indentWithSpaces: codeStyle.spacingType !== 'tabs',
            indentSpaceCount: codeStyle.spacingType === 'twoSpace' ? 2 : 4,
        });
    }

    /**
     * @since 1.0.0
     */
    public write(): string {
        return this.pluginClass.write(this.getFormatter(), 0);
    }

    /**
     * Flatten a multi-dimensional array into a one-dimensional array because I refuse to introduce `core-js` as a
     * polyfill for `Array.prototype.flat()` simple because Node 10 LTS and IE/Edge don't support it.
     *
     * Seriously. Fuck JS.
     *
     * @param arr
     *
     * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/flat
     * @see https://stackoverflow.com/a/15030117
     */
    private flatten(arr: Array<any>): Array<any> {
        return arr.reduce((flat, next) => flat.concat(Array.isArray(next) ? this.flatten(next) : next), []);
    }
}
