/**
 * Tests to verify the correct ordering of views in the sidebar
 * Expected order: Kanban, Notes, Scheduled Tasks, Tags
 */

import * as fs from 'fs';
import * as path from 'path';

describe('View Order Configuration', () => {
    let packageJson: any;

    beforeAll(() => {
        // Read the package.json to verify view ordering
        const packageJsonPath = path.join(__dirname, '..', 'package.json');
        const packageJsonContent = fs.readFileSync(packageJsonPath, 'utf-8');
        packageJson = JSON.parse(packageJsonContent);
    });

    describe('Sidebar View Order', () => {
        it('should have views defined in package.json', () => {
            expect(packageJson.contributes).toBeDefined();
            expect(packageJson.contributes.views).toBeDefined();
            expect(packageJson.contributes.views['chroma-workspace']).toBeDefined();
        });

        it('should have exactly 4 views', () => {
            const views = packageJson.contributes.views['chroma-workspace'];
            expect(views.length).toBe(4);
        });

        it('should have Kanban as the first view', () => {
            const views = packageJson.contributes.views['chroma-workspace'];
            expect(views[0].id).toBe('kanban');
            expect(views[0].name).toBe('Kanban');
        });

        it('should have Notes as the second view', () => {
            const views = packageJson.contributes.views['chroma-workspace'];
            expect(views[1].id).toBe('notes');
            expect(views[1].name).toBe('Notes');
        });

        it('should have Scheduled Tasks as the third view', () => {
            const views = packageJson.contributes.views['chroma-workspace'];
            expect(views[2].id).toBe('scheduledTasks');
            expect(views[2].name).toBe('Scheduled Tasks');
        });

        it('should have Tags as the fourth view', () => {
            const views = packageJson.contributes.views['chroma-workspace'];
            expect(views[3].id).toBe('tags');
            expect(views[3].name).toBe('Tags');
        });

        it('should verify complete order: Kanban -> Notes -> Scheduled Tasks -> Tags', () => {
            const views = packageJson.contributes.views['chroma-workspace'];
            const expectedIds = ['kanban', 'notes', 'scheduledTasks', 'tags'];
            const actualIds = views.map((v: any) => v.id);
            
            expect(actualIds).toEqual(expectedIds);
        });

        it('should verify all views have icons', () => {
            const views = packageJson.contributes.views['chroma-workspace'];
            views.forEach((view: any) => {
                expect(view.icon).toBeDefined();
                expect(view.icon).toBeTruthy();
            });
        });

        it('should verify all views have unique IDs', () => {
            const views = packageJson.contributes.views['chroma-workspace'];
            const ids = views.map((v: any) => v.id);
            const uniqueIds = new Set(ids);
            
            expect(uniqueIds.size).toBe(views.length);
        });

        it('should verify all views have names', () => {
            const views = packageJson.contributes.views['chroma-workspace'];
            views.forEach((view: any) => {
                expect(view.name).toBeDefined();
                expect(typeof view.name).toBe('string');
                expect(view.name.length).toBeGreaterThan(0);
            });
        });
    });

    describe('View Container Configuration', () => {
        it('should have viewsContainers defined', () => {
            expect(packageJson.contributes.viewsContainers).toBeDefined();
            expect(packageJson.contributes.viewsContainers.activitybar).toBeDefined();
        });

        it('should have Chroma Workspace container', () => {
            const containers = packageJson.contributes.viewsContainers.activitybar;
            const chromaContainer = containers.find((c: any) => c.id === 'chroma-workspace');
            
            expect(chromaContainer).toBeDefined();
            expect(chromaContainer.title).toBe('Chroma Workspace');
        });

        it('should verify container has all required properties', () => {
            const containers = packageJson.contributes.viewsContainers.activitybar;
            const chromaContainer = containers.find((c: any) => c.id === 'chroma-workspace');
            
            expect(chromaContainer.id).toBeDefined();
            expect(chromaContainer.title).toBeDefined();
            expect(chromaContainer.icon).toBeDefined();
        });
    });

    describe('View Configuration Consistency', () => {
        it('should ensure all views in container are defined in views section', () => {
            const views = packageJson.contributes.views['chroma-workspace'];
            
            // Each view should have required properties
            views.forEach((view: any) => {
                expect(view.id).toBeDefined();
                expect(view.name).toBeDefined();
                expect(view.icon).toBeDefined();
            });
        });

        it('should not have duplicate view IDs across any containers', () => {
            const allViews: any[] = [];
            const viewsContainers = packageJson.contributes.views;
            
            Object.values(viewsContainers).forEach((container: any) => {
                allViews.push(...container);
            });
            
            const viewIds = allViews.map((v: any) => v.id);
            const uniqueIds = new Set(viewIds);
            
            expect(uniqueIds.size).toBe(viewIds.length);
        });

        it('should maintain correct order when compared to expected sequence', () => {
            const views = packageJson.contributes.views['chroma-workspace'];
            const expectedOrder = ['kanban', 'notes', 'scheduledTasks', 'tags'];
            
            expectedOrder.forEach((expectedId, index) => {
                expect(views[index].id).toBe(expectedId);
            });
        });
    });

    describe('Notes View Position', () => {
        it('should have Notes view immediately after Kanban view', () => {
            const views = packageJson.contributes.views['chroma-workspace'];
            const kanbanIndex = views.findIndex((v: any) => v.id === 'kanban');
            const notesIndex = views.findIndex((v: any) => v.id === 'notes');
            
            expect(kanbanIndex).toBe(0);
            expect(notesIndex).toBe(1);
            expect(notesIndex - kanbanIndex).toBe(1);
        });

        it('should have Notes view before Scheduled Tasks view', () => {
            const views = packageJson.contributes.views['chroma-workspace'];
            const notesIndex = views.findIndex((v: any) => v.id === 'notes');
            const scheduledTasksIndex = views.findIndex((v: any) => v.id === 'scheduledTasks');
            
            expect(notesIndex).toBeLessThan(scheduledTasksIndex);
        });

        it('should have Notes view before Tags view', () => {
            const views = packageJson.contributes.views['chroma-workspace'];
            const notesIndex = views.findIndex((v: any) => v.id === 'notes');
            const tagsIndex = views.findIndex((v: any) => v.id === 'tags');
            
            expect(notesIndex).toBeLessThan(tagsIndex);
        });
    });
});
