import * as vscode from 'vscode';
import { getAllTags } from '../database';
import { Tag } from '../models/Tag';
import { hexToName } from '../utils/colors';

export class TagsProvider implements vscode.TreeDataProvider<Tag> {
    private _onDidChangeTreeData: vscode.EventEmitter<Tag | undefined | null | void> = new vscode.EventEmitter<Tag | undefined | null | void>();
    readonly onDidChangeTreeData: vscode.Event<Tag | undefined | null | void> = this._onDidChangeTreeData.event;

    refresh(): void {
        this._onDidChangeTreeData.fire();
    }

    getTreeItem(element: Tag): vscode.TreeItem {
        const treeItem = new vscode.TreeItem(element.name);
        treeItem.contextValue = 'tag';
        treeItem.id = element.id;
        const name = hexToName(element.color);
        treeItem.tooltip = name ? `Color: ${name}` : `Color: ${element.color}`;
        return treeItem;
    }

    getChildren(element?: Tag): Thenable<Tag[]> {
        if (element) {
            return Promise.resolve([]);
        } else {
            return Promise.resolve(getAllTags());
        }
    }
}
