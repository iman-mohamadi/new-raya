import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const REGISTRY_DIR = path.resolve(__dirname, '../registry');
const UI_DIR = path.join(REGISTRY_DIR, 'ui');
const PUBLIC_REGISTRY_DIR = path.resolve(__dirname, '../public/registry');

async function build() {
    await fs.mkdir(PUBLIC_REGISTRY_DIR, { recursive: true });

    const registryItems = [];
    const componentFolders = await fs.readdir(UI_DIR);

    for (const folderName of componentFolders) {
        const folderPath = path.join(UI_DIR, folderName);
        const stat = await fs.stat(folderPath);

        if (!stat.isDirectory()) continue;

        const filesInFolder = await fs.readdir(folderPath);

        // Grab all .vue and .ts files, specifically targeting the index.ts setup
        const componentFiles = filesInFolder.filter(f => f.endsWith('.vue') || f.endsWith('.ts'));

        if (componentFiles.length === 0) continue;

        // Default metadata
        let meta = {
            title: folderName.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
            description: `A custom cinematic ${folderName} component.`,
            dependencies: [],
            registryDependencies: []
        };

        // Merge custom dependencies if meta.json exists
        if (filesInFolder.includes('meta.json')) {
            const metaContent = await fs.readFile(path.join(folderPath, 'meta.json'), 'utf-8');
            meta = { ...meta, ...JSON.parse(metaContent) };
        }

        const componentPayload = {
            name: folderName,
            type: "registry:component",
            title: meta.title,
            description: meta.description,
            dependencies: meta.dependencies,
            registryDependencies: meta.registryDependencies,
            files: []
        };

        // Add all captured files to the payload
        for (const fileName of componentFiles) {
            const filePath = path.join(folderPath, fileName);
            const content = await fs.readFile(filePath, 'utf-8');

            componentPayload.files.push({
                path: `registry/ui/${folderName}/${fileName}`,
                content: content,
                type: "registry:component",
                target: `components/${folderName}/${fileName}`
            });
        }

        registryItems.push(componentPayload);

        // Write the individual JSON file for your CLI to fetch
        const cliPayload = {
            $schema: "https://shadcn-vue.com/schema/registry-item.json",
            ...componentPayload,
            files: componentPayload.files.map(f => ({
                path: f.path.split('/').pop(),
                content: f.content,
                type: f.type,
                target: f.target
            }))
        };

        await fs.writeFile(
            path.join(PUBLIC_REGISTRY_DIR, `${folderName}.json`),
            JSON.stringify(cliPayload, null, 2)
        );
        console.log(`✅ Built payload with all files: ${folderName}.json`);
    }

    // Auto-generate the master registry.json
    const masterRegistry = {
        $schema: "https://shadcn-vue.com/schema/registry.json",
        name: "raya-ui",
        homepage: "https://raya-ui.com",
        items: registryItems.map(item => ({
            name: item.name,
            type: item.type,
            title: item.title,
            description: item.description,
            dependencies: item.dependencies,
            registryDependencies: item.registryDependencies,
            files: item.files.map(f => ({
                path: f.path,
                type: f.type
            }))
        }))
    };

    await fs.writeFile(
        path.join(REGISTRY_DIR, 'registry.json'),
        JSON.stringify(masterRegistry, null, 2)
    );

    await fs.writeFile(
        path.join(PUBLIC_REGISTRY_DIR, 'index.json'),
        JSON.stringify(masterRegistry, null, 2)
    );

    console.log('🎉 Automated Registry Build Complete!');
}

build().catch(console.error);