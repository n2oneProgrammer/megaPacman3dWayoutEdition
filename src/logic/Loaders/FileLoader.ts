const FileLoader = {
    async load(src: string): Promise<string> {
        const response = await fetch(src);
        return response.text();
    }
}
export default FileLoader;
