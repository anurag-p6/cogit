(()=>{"use strict";(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/frontend/components/CopyButton.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>CopyButton
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$26$2e$6$2e$5_react$2d$dom$40$19$2e$3$2e$1_react$40$19$2e$3$2e$1_$5f$react$40$19$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.4.2_@types+node@26.6.5_react-dom@19.3.1_react@19.3.1__react@19.3.1/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$26$2e$6$2e$5_react$2d$dom$40$19$2e$3$2e$1_react$40$19$2e$3$2e$1_$5f$react$40$19$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.4.2_@types+node@26.6.5_react-dom@19.3.1_react@19.3.1__react@19.3.1/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
function CopyButton({ text, label, className }) {
    _s();
    const [copied, setCopied] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$26$2e$6$2e$5_react$2d$dom$40$19$2e$3$2e$1_react$40$19$2e$3$2e$1_$5f$react$40$19$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const timer = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$26$2e$6$2e$5_react$2d$dom$40$19$2e$3$2e$1_react$40$19$2e$3$2e$1_$5f$react$40$19$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const copy = async ()=>{
        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            if (timer.current !== null) {
                window.clearTimeout(timer.current);
            }
            timer.current = window.setTimeout(()=>setCopied(false), 1400);
        } catch  {
            setCopied(false);
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$26$2e$6$2e$5_react$2d$dom$40$19$2e$3$2e$1_react$40$19$2e$3$2e$1_$5f$react$40$19$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
        className: `copy-btn${copied ? " copied" : ""}${className ? ` ${className}` : ""}`,
        type: "button",
        onClick: copy,
        "aria-label": copied ? "Copied" : label,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$26$2e$6$2e$5_react$2d$dom$40$19$2e$3$2e$1_react$40$19$2e$3$2e$1_$5f$react$40$19$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
            className: "ic",
            "aria-hidden": "true",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$26$2e$6$2e$5_react$2d$dom$40$19$2e$3$2e$1_react$40$19$2e$3$2e$1_$5f$react$40$19$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("use", {
                href: copied ? "#i-check" : "#i-copy"
            }, void 0, false, {
                fileName: "[project]/frontend/components/CopyButton.tsx",
                lineNumber: 38,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/frontend/components/CopyButton.tsx",
            lineNumber: 37,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/frontend/components/CopyButton.tsx",
        lineNumber: 31,
        columnNumber: 5
    }, this);
}
_s(CopyButton, "EPdnPZIh2PXlMLN/LsXjeM8tZGQ=");
_c = CopyButton;
var _c;
__turbopack_context__.k.register(_c, "CopyButton");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/frontend/components/Icon.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Icon
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$26$2e$6$2e$5_react$2d$dom$40$19$2e$3$2e$1_react$40$19$2e$3$2e$1_$5f$react$40$19$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.4.2_@types+node@26.6.5_react-dom@19.3.1_react@19.3.1__react@19.3.1/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
;
function Icon({ name, className }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$26$2e$6$2e$5_react$2d$dom$40$19$2e$3$2e$1_react$40$19$2e$3$2e$1_$5f$react$40$19$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        className: className ?? "ic",
        "aria-hidden": "true",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$26$2e$6$2e$5_react$2d$dom$40$19$2e$3$2e$1_react$40$19$2e$3$2e$1_$5f$react$40$19$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("use", {
            href: `#${name}`
        }, void 0, false, {
            fileName: "[project]/frontend/components/Icon.tsx",
            lineNumber: 4,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/frontend/components/Icon.tsx",
        lineNumber: 3,
        columnNumber: 5
    }, this);
}
_c = Icon;
var _c;
__turbopack_context__.k.register(_c, "Icon");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/frontend/components/viewer/BranchRail.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>BranchRail
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$26$2e$6$2e$5_react$2d$dom$40$19$2e$3$2e$1_react$40$19$2e$3$2e$1_$5f$react$40$19$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.4.2_@types+node@26.6.5_react-dom@19.3.1_react@19.3.1__react@19.3.1/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$lib$2f$format$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/lib/format.ts [app-client] (ecmascript)");
"use client";
;
;
function BranchRail({ branches, colors, counts, total, filter, onFilter, repo, labels, currentBlock, blockDuration, createdLabel }) {
    const expiry = repo === null ? null : Math.max(0, Math.round((repo.expiresAtBlock - currentBlock) * blockDuration));
    const expiryLabel = expiry === null ? "—" : expiry > 86400 ? `in ${Math.round(expiry / 86400)} d` : `in ${Math.round(expiry / 3600)} h`;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$26$2e$6$2e$5_react$2d$dom$40$19$2e$3$2e$1_react$40$19$2e$3$2e$1_$5f$react$40$19$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("aside", {
        className: "rail",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$26$2e$6$2e$5_react$2d$dom$40$19$2e$3$2e$1_react$40$19$2e$3$2e$1_$5f$react$40$19$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "rail-label",
                children: [
                    "Branches ",
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$26$2e$6$2e$5_react$2d$dom$40$19$2e$3$2e$1_react$40$19$2e$3$2e$1_$5f$react$40$19$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "rail-count",
                        children: branches.length
                    }, void 0, false, {
                        fileName: "[project]/frontend/components/viewer/BranchRail.tsx",
                        lineNumber: 47,
                        columnNumber: 18
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/frontend/components/viewer/BranchRail.tsx",
                lineNumber: 46,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$26$2e$6$2e$5_react$2d$dom$40$19$2e$3$2e$1_react$40$19$2e$3$2e$1_$5f$react$40$19$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "rail-list",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$26$2e$6$2e$5_react$2d$dom$40$19$2e$3$2e$1_react$40$19$2e$3$2e$1_$5f$react$40$19$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        className: `rail-row${filter === "all" ? " is-on" : ""}`,
                        type: "button",
                        onClick: ()=>onFilter("all"),
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$26$2e$6$2e$5_react$2d$dom$40$19$2e$3$2e$1_react$40$19$2e$3$2e$1_$5f$react$40$19$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "rail-dot rail-dot-all"
                            }, void 0, false, {
                                fileName: "[project]/frontend/components/viewer/BranchRail.tsx",
                                lineNumber: 55,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$26$2e$6$2e$5_react$2d$dom$40$19$2e$3$2e$1_react$40$19$2e$3$2e$1_$5f$react$40$19$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "rail-main",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$26$2e$6$2e$5_react$2d$dom$40$19$2e$3$2e$1_react$40$19$2e$3$2e$1_$5f$react$40$19$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "rail-name",
                                        children: "All branches"
                                    }, void 0, false, {
                                        fileName: "[project]/frontend/components/viewer/BranchRail.tsx",
                                        lineNumber: 57,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$26$2e$6$2e$5_react$2d$dom$40$19$2e$3$2e$1_react$40$19$2e$3$2e$1_$5f$react$40$19$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "rail-meta",
                                        children: [
                                            total,
                                            " commits"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/frontend/components/viewer/BranchRail.tsx",
                                        lineNumber: 58,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/frontend/components/viewer/BranchRail.tsx",
                                lineNumber: 56,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/frontend/components/viewer/BranchRail.tsx",
                        lineNumber: 50,
                        columnNumber: 9
                    }, this),
                    branches.map((branch)=>{
                        const color = colors.get(branch.name) ?? "#57564F";
                        const count = counts.get(branch.name) ?? 0;
                        const ownerLabel = labels[branch.owner.toLowerCase()] ?? (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$lib$2f$format$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["shortAddress"])(branch.owner);
                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$26$2e$6$2e$5_react$2d$dom$40$19$2e$3$2e$1_react$40$19$2e$3$2e$1_$5f$react$40$19$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            className: `rail-row${filter === branch.name ? " is-on" : ""}`,
                            type: "button",
                            onClick: ()=>onFilter(branch.name),
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$26$2e$6$2e$5_react$2d$dom$40$19$2e$3$2e$1_react$40$19$2e$3$2e$1_$5f$react$40$19$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "rail-dot",
                                    style: {
                                        "--c": color
                                    }
                                }, void 0, false, {
                                    fileName: "[project]/frontend/components/viewer/BranchRail.tsx",
                                    lineNumber: 72,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$26$2e$6$2e$5_react$2d$dom$40$19$2e$3$2e$1_react$40$19$2e$3$2e$1_$5f$react$40$19$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "rail-main",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$26$2e$6$2e$5_react$2d$dom$40$19$2e$3$2e$1_react$40$19$2e$3$2e$1_$5f$react$40$19$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "rail-name",
                                            children: branch.name
                                        }, void 0, false, {
                                            fileName: "[project]/frontend/components/viewer/BranchRail.tsx",
                                            lineNumber: 74,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$26$2e$6$2e$5_react$2d$dom$40$19$2e$3$2e$1_react$40$19$2e$3$2e$1_$5f$react$40$19$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "rail-meta",
                                            children: [
                                                count,
                                                " commit",
                                                count === 1 ? "" : "s",
                                                " ·",
                                                " ",
                                                branch.head === "" ? "no head" : `head ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$lib$2f$format$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["shortHex"])(branch.head)}`
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/frontend/components/viewer/BranchRail.tsx",
                                            lineNumber: 75,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/frontend/components/viewer/BranchRail.tsx",
                                    lineNumber: 73,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$26$2e$6$2e$5_react$2d$dom$40$19$2e$3$2e$1_react$40$19$2e$3$2e$1_$5f$react$40$19$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "rail-owner mono",
                                    children: ownerLabel
                                }, void 0, false, {
                                    fileName: "[project]/frontend/components/viewer/BranchRail.tsx",
                                    lineNumber: 80,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, branch.key, true, {
                            fileName: "[project]/frontend/components/viewer/BranchRail.tsx",
                            lineNumber: 66,
                            columnNumber: 13
                        }, this);
                    })
                ]
            }, void 0, true, {
                fileName: "[project]/frontend/components/viewer/BranchRail.tsx",
                lineNumber: 49,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$26$2e$6$2e$5_react$2d$dom$40$19$2e$3$2e$1_react$40$19$2e$3$2e$1_$5f$react$40$19$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "rail-rule"
            }, void 0, false, {
                fileName: "[project]/frontend/components/viewer/BranchRail.tsx",
                lineNumber: 86,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$26$2e$6$2e$5_react$2d$dom$40$19$2e$3$2e$1_react$40$19$2e$3$2e$1_$5f$react$40$19$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "rail-label",
                children: "Repo"
            }, void 0, false, {
                fileName: "[project]/frontend/components/viewer/BranchRail.tsx",
                lineNumber: 87,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$26$2e$6$2e$5_react$2d$dom$40$19$2e$3$2e$1_react$40$19$2e$3$2e$1_$5f$react$40$19$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("dl", {
                className: "kv",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$26$2e$6$2e$5_react$2d$dom$40$19$2e$3$2e$1_react$40$19$2e$3$2e$1_$5f$react$40$19$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "kv-row",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$26$2e$6$2e$5_react$2d$dom$40$19$2e$3$2e$1_react$40$19$2e$3$2e$1_$5f$react$40$19$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("dt", {
                                children: "Owner"
                            }, void 0, false, {
                                fileName: "[project]/frontend/components/viewer/BranchRail.tsx",
                                lineNumber: 90,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$26$2e$6$2e$5_react$2d$dom$40$19$2e$3$2e$1_react$40$19$2e$3$2e$1_$5f$react$40$19$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("dd", {
                                className: "mono",
                                children: repo === null ? "—" : `${labels[repo.owner.toLowerCase()] ?? (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$lib$2f$format$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["shortAddress"])(repo.owner)} · ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$lib$2f$format$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["shortAddress"])(repo.owner)}`
                            }, void 0, false, {
                                fileName: "[project]/frontend/components/viewer/BranchRail.tsx",
                                lineNumber: 91,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/frontend/components/viewer/BranchRail.tsx",
                        lineNumber: 89,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$26$2e$6$2e$5_react$2d$dom$40$19$2e$3$2e$1_react$40$19$2e$3$2e$1_$5f$react$40$19$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "kv-row",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$26$2e$6$2e$5_react$2d$dom$40$19$2e$3$2e$1_react$40$19$2e$3$2e$1_$5f$react$40$19$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("dt", {
                                children: "Created"
                            }, void 0, false, {
                                fileName: "[project]/frontend/components/viewer/BranchRail.tsx",
                                lineNumber: 98,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$26$2e$6$2e$5_react$2d$dom$40$19$2e$3$2e$1_react$40$19$2e$3$2e$1_$5f$react$40$19$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("dd", {
                                className: "mono",
                                children: createdLabel
                            }, void 0, false, {
                                fileName: "[project]/frontend/components/viewer/BranchRail.tsx",
                                lineNumber: 99,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/frontend/components/viewer/BranchRail.tsx",
                        lineNumber: 97,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$26$2e$6$2e$5_react$2d$dom$40$19$2e$3$2e$1_react$40$19$2e$3$2e$1_$5f$react$40$19$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "kv-row",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$26$2e$6$2e$5_react$2d$dom$40$19$2e$3$2e$1_react$40$19$2e$3$2e$1_$5f$react$40$19$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("dt", {
                                children: "Expires"
                            }, void 0, false, {
                                fileName: "[project]/frontend/components/viewer/BranchRail.tsx",
                                lineNumber: 102,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$26$2e$6$2e$5_react$2d$dom$40$19$2e$3$2e$1_react$40$19$2e$3$2e$1_$5f$react$40$19$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("dd", {
                                className: "mono",
                                children: expiryLabel
                            }, void 0, false, {
                                fileName: "[project]/frontend/components/viewer/BranchRail.tsx",
                                lineNumber: 103,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/frontend/components/viewer/BranchRail.tsx",
                        lineNumber: 101,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$26$2e$6$2e$5_react$2d$dom$40$19$2e$3$2e$1_react$40$19$2e$3$2e$1_$5f$react$40$19$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "kv-row",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$26$2e$6$2e$5_react$2d$dom$40$19$2e$3$2e$1_react$40$19$2e$3$2e$1_$5f$react$40$19$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("dt", {
                                children: "Entity"
                            }, void 0, false, {
                                fileName: "[project]/frontend/components/viewer/BranchRail.tsx",
                                lineNumber: 106,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$26$2e$6$2e$5_react$2d$dom$40$19$2e$3$2e$1_react$40$19$2e$3$2e$1_$5f$react$40$19$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("dd", {
                                className: "mono",
                                children: repo === null ? "—" : (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$lib$2f$format$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["shortHex"])(repo.entityKey, 6, 4)
                            }, void 0, false, {
                                fileName: "[project]/frontend/components/viewer/BranchRail.tsx",
                                lineNumber: 107,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/frontend/components/viewer/BranchRail.tsx",
                        lineNumber: 105,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/frontend/components/viewer/BranchRail.tsx",
                lineNumber: 88,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$26$2e$6$2e$5_react$2d$dom$40$19$2e$3$2e$1_react$40$19$2e$3$2e$1_$5f$react$40$19$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "rail-note",
                children: "Branch heads are single-writer: only the owner's wallet can advance them."
            }, void 0, false, {
                fileName: "[project]/frontend/components/viewer/BranchRail.tsx",
                lineNumber: 110,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/frontend/components/viewer/BranchRail.tsx",
        lineNumber: 45,
        columnNumber: 5
    }, this);
}
_c = BranchRail;
var _c;
__turbopack_context__.k.register(_c, "BranchRail");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/frontend/components/viewer/CommitGraph.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>CommitGraph
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$26$2e$6$2e$5_react$2d$dom$40$19$2e$3$2e$1_react$40$19$2e$3$2e$1_$5f$react$40$19$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.4.2_@types+node@26.6.5_react-dom@19.3.1_react@19.3.1__react@19.3.1/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$26$2e$6$2e$5_react$2d$dom$40$19$2e$3$2e$1_react$40$19$2e$3$2e$1_$5f$react$40$19$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.4.2_@types+node@26.6.5_react-dom@19.3.1_react@19.3.1__react@19.3.1/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$lib$2f$format$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/lib/format.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
function NodeShape({ kind, x, y, className, stroke, data, title }) {
    if (kind === "note") {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$26$2e$6$2e$5_react$2d$dom$40$19$2e$3$2e$1_react$40$19$2e$3$2e$1_$5f$react$40$19$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
            cx: x,
            cy: y,
            r: 6.5,
            className: className,
            stroke: stroke,
            "data-commit": data,
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$26$2e$6$2e$5_react$2d$dom$40$19$2e$3$2e$1_react$40$19$2e$3$2e$1_$5f$react$40$19$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("title", {
                children: title
            }, void 0, false, {
                fileName: "[project]/frontend/components/viewer/CommitGraph.tsx",
                lineNumber: 44,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/frontend/components/viewer/CommitGraph.tsx",
            lineNumber: 43,
            columnNumber: 7
        }, this);
    }
    if (kind === "scratch") {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$26$2e$6$2e$5_react$2d$dom$40$19$2e$3$2e$1_react$40$19$2e$3$2e$1_$5f$react$40$19$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
            x: x - 5.5,
            y: y - 5.5,
            width: 11,
            height: 11,
            rx: 2.5,
            className: className,
            stroke: stroke,
            "data-commit": data,
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$26$2e$6$2e$5_react$2d$dom$40$19$2e$3$2e$1_react$40$19$2e$3$2e$1_$5f$react$40$19$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("title", {
                children: title
            }, void 0, false, {
                fileName: "[project]/frontend/components/viewer/CommitGraph.tsx",
                lineNumber: 60,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/frontend/components/viewer/CommitGraph.tsx",
            lineNumber: 50,
            columnNumber: 7
        }, this);
    }
    if (kind === "decision") {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$26$2e$6$2e$5_react$2d$dom$40$19$2e$3$2e$1_react$40$19$2e$3$2e$1_$5f$react$40$19$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
            d: `M ${x} ${y - 8} L ${x + 8} ${y} L ${x} ${y + 8} L ${x - 8} ${y} Z`,
            className: className,
            stroke: stroke,
            "data-commit": data,
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$26$2e$6$2e$5_react$2d$dom$40$19$2e$3$2e$1_react$40$19$2e$3$2e$1_$5f$react$40$19$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("title", {
                children: title
            }, void 0, false, {
                fileName: "[project]/frontend/components/viewer/CommitGraph.tsx",
                lineNumber: 72,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/frontend/components/viewer/CommitGraph.tsx",
            lineNumber: 66,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$26$2e$6$2e$5_react$2d$dom$40$19$2e$3$2e$1_react$40$19$2e$3$2e$1_$5f$react$40$19$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
        className: className,
        "data-commit": data,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$26$2e$6$2e$5_react$2d$dom$40$19$2e$3$2e$1_react$40$19$2e$3$2e$1_$5f$react$40$19$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("title", {
                children: title
            }, void 0, false, {
                fileName: "[project]/frontend/components/viewer/CommitGraph.tsx",
                lineNumber: 78,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$26$2e$6$2e$5_react$2d$dom$40$19$2e$3$2e$1_react$40$19$2e$3$2e$1_$5f$react$40$19$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                cx: x,
                cy: y,
                r: 6.5,
                stroke: stroke
            }, void 0, false, {
                fileName: "[project]/frontend/components/viewer/CommitGraph.tsx",
                lineNumber: 79,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$26$2e$6$2e$5_react$2d$dom$40$19$2e$3$2e$1_react$40$19$2e$3$2e$1_$5f$react$40$19$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                cx: x,
                cy: y,
                r: 10.5,
                className: "g-ring",
                fill: "none",
                stroke: stroke
            }, void 0, false, {
                fileName: "[project]/frontend/components/viewer/CommitGraph.tsx",
                lineNumber: 80,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/frontend/components/viewer/CommitGraph.tsx",
        lineNumber: 77,
        columnNumber: 5
    }, this);
}
_c = NodeShape;
function CommitGraph({ graph, commits, selectedId, dimCommits, dimBranches, nowSeconds, onSelect }) {
    _s();
    const [tip, setTip] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$26$2e$6$2e$5_react$2d$dom$40$19$2e$3$2e$1_react$40$19$2e$3$2e$1_$5f$react$40$19$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const byId = new Map(commits.map((c)=>[
            c.envelope.commitHash,
            c
        ]));
    const dimLane = (branch)=>dimBranches.has(branch);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$26$2e$6$2e$5_react$2d$dom$40$19$2e$3$2e$1_react$40$19$2e$3$2e$1_$5f$react$40$19$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "graph",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$26$2e$6$2e$5_react$2d$dom$40$19$2e$3$2e$1_react$40$19$2e$3$2e$1_$5f$react$40$19$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                viewBox: `0 0 ${graph.width} ${graph.height}`,
                role: "img",
                "aria-label": "Commit graph across branches",
                preserveAspectRatio: "xMidYMin meet",
                className: "graph-svg",
                children: [
                    graph.ticks.map((tick)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$26$2e$6$2e$5_react$2d$dom$40$19$2e$3$2e$1_react$40$19$2e$3$2e$1_$5f$react$40$19$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$26$2e$6$2e$5_react$2d$dom$40$19$2e$3$2e$1_react$40$19$2e$3$2e$1_$5f$react$40$19$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                                    x1: 52,
                                    y1: tick.y,
                                    x2: 588,
                                    y2: tick.y,
                                    className: "g-tick"
                                }, void 0, false, {
                                    fileName: "[project]/frontend/components/viewer/CommitGraph.tsx",
                                    lineNumber: 110,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$26$2e$6$2e$5_react$2d$dom$40$19$2e$3$2e$1_react$40$19$2e$3$2e$1_$5f$react$40$19$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("text", {
                                    x: 10,
                                    y: tick.y + 3,
                                    className: "g-tick-label",
                                    children: tick.label
                                }, void 0, false, {
                                    fileName: "[project]/frontend/components/viewer/CommitGraph.tsx",
                                    lineNumber: 111,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, `t${tick.y}${tick.label}`, true, {
                            fileName: "[project]/frontend/components/viewer/CommitGraph.tsx",
                            lineNumber: 109,
                            columnNumber: 11
                        }, this)),
                    graph.lanes.map((lane)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$26$2e$6$2e$5_react$2d$dom$40$19$2e$3$2e$1_react$40$19$2e$3$2e$1_$5f$react$40$19$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                            x1: lane.x,
                            y1: lane.y1,
                            x2: lane.x,
                            y2: lane.y2,
                            className: `g-lane${dimLane(lane.branch) ? " is-dim" : ""}`,
                            stroke: lane.color,
                            "data-branch": lane.branch
                        }, `l${lane.branch}`, false, {
                            fileName: "[project]/frontend/components/viewer/CommitGraph.tsx",
                            lineNumber: 118,
                            columnNumber: 11
                        }, this)),
                    graph.forks.map((fork, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$26$2e$6$2e$5_react$2d$dom$40$19$2e$3$2e$1_react$40$19$2e$3$2e$1_$5f$react$40$19$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                            d: fork.d,
                            className: "g-fork",
                            stroke: fork.color,
                            fill: "none"
                        }, `f${index}`, false, {
                            fileName: "[project]/frontend/components/viewer/CommitGraph.tsx",
                            lineNumber: 131,
                            columnNumber: 11
                        }, this)),
                    graph.nodes.map((node)=>{
                        const commit = byId.get(node.id);
                        const dim = dimCommits.has(node.id);
                        const sel = node.id === selectedId;
                        const stroke = node.invalid ? "#B4483F" : node.color;
                        const className = `g-node n-${node.kind}${node.invalid ? " n-invalid" : ""}${dim ? " is-dim" : ""}${sel ? " is-sel" : ""}`;
                        const title = commit?.body?.summary ?? (node.invalid ? "Body sealed — verification failed" : "Body sealed — group key required");
                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$26$2e$6$2e$5_react$2d$dom$40$19$2e$3$2e$1_react$40$19$2e$3$2e$1_$5f$react$40$19$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
                            children: [
                                sel ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$26$2e$6$2e$5_react$2d$dom$40$19$2e$3$2e$1_react$40$19$2e$3$2e$1_$5f$react$40$19$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                                    className: "g-halo",
                                    cx: node.x,
                                    cy: node.y,
                                    r: node.kind === "milestone" ? 15 : 13
                                }, void 0, false, {
                                    fileName: "[project]/frontend/components/viewer/CommitGraph.tsx",
                                    lineNumber: 150,
                                    columnNumber: 17
                                }, this) : null,
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$26$2e$6$2e$5_react$2d$dom$40$19$2e$3$2e$1_react$40$19$2e$3$2e$1_$5f$react$40$19$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
                                    onClick: ()=>onSelect(node.id),
                                    onMouseEnter: (event)=>{
                                        setTip({
                                            x: event.clientX,
                                            y: event.clientY,
                                            text: `${node.kind} · ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$lib$2f$format$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["timeAgo"])(node.ts, nowSeconds)} — ${title}`
                                        });
                                    },
                                    onMouseMove: (event)=>{
                                        setTip((current)=>current === null ? null : {
                                                ...current,
                                                x: event.clientX,
                                                y: event.clientY
                                            });
                                    },
                                    onMouseLeave: ()=>setTip(null),
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$26$2e$6$2e$5_react$2d$dom$40$19$2e$3$2e$1_react$40$19$2e$3$2e$1_$5f$react$40$19$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(NodeShape, {
                                        kind: node.kind,
                                        x: node.x,
                                        y: node.y,
                                        className: className,
                                        stroke: stroke,
                                        data: node.id,
                                        title: title
                                    }, void 0, false, {
                                        fileName: "[project]/frontend/components/viewer/CommitGraph.tsx",
                                        lineNumber: 170,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/frontend/components/viewer/CommitGraph.tsx",
                                    lineNumber: 152,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, node.id, true, {
                            fileName: "[project]/frontend/components/viewer/CommitGraph.tsx",
                            lineNumber: 148,
                            columnNumber: 13
                        }, this);
                    }),
                    graph.head !== null ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$26$2e$6$2e$5_react$2d$dom$40$19$2e$3$2e$1_react$40$19$2e$3$2e$1_$5f$react$40$19$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("text", {
                        x: graph.head.x,
                        y: graph.head.y,
                        className: "g-head-label",
                        children: [
                            "HEAD · ",
                            graph.head.branch
                        ]
                    }, void 0, true, {
                        fileName: "[project]/frontend/components/viewer/CommitGraph.tsx",
                        lineNumber: 185,
                        columnNumber: 11
                    }, this) : null
                ]
            }, void 0, true, {
                fileName: "[project]/frontend/components/viewer/CommitGraph.tsx",
                lineNumber: 101,
                columnNumber: 7
            }, this),
            tip !== null ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$26$2e$6$2e$5_react$2d$dom$40$19$2e$3$2e$1_react$40$19$2e$3$2e$1_$5f$react$40$19$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "g-tooltip",
                style: {
                    left: tip.x,
                    top: tip.y
                },
                children: tip.text
            }, void 0, false, {
                fileName: "[project]/frontend/components/viewer/CommitGraph.tsx",
                lineNumber: 191,
                columnNumber: 9
            }, this) : null
        ]
    }, void 0, true, {
        fileName: "[project]/frontend/components/viewer/CommitGraph.tsx",
        lineNumber: 100,
        columnNumber: 5
    }, this);
}
_s(CommitGraph, "WEmjOijiEHVJ/+SAc5yy/g+lt6M=");
_c1 = CommitGraph;
var _c, _c1;
__turbopack_context__.k.register(_c, "NodeShape");
__turbopack_context__.k.register(_c1, "CommitGraph");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/frontend/components/viewer/CommitList.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>CommitList
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$26$2e$6$2e$5_react$2d$dom$40$19$2e$3$2e$1_react$40$19$2e$3$2e$1_$5f$react$40$19$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.4.2_@types+node@26.6.5_react-dom@19.3.1_react@19.3.1__react@19.3.1/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$components$2f$Icon$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/components/Icon.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$lib$2f$format$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/lib/format.ts [app-client] (ecmascript)");
"use client";
;
;
;
function CommitList({ commits, total, selectedId, onSelect, colors, labels, nowSeconds, enterIds }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$26$2e$6$2e$5_react$2d$dom$40$19$2e$3$2e$1_react$40$19$2e$3$2e$1_$5f$react$40$19$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "list",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$26$2e$6$2e$5_react$2d$dom$40$19$2e$3$2e$1_react$40$19$2e$3$2e$1_$5f$react$40$19$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "list-head",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$26$2e$6$2e$5_react$2d$dom$40$19$2e$3$2e$1_react$40$19$2e$3$2e$1_$5f$react$40$19$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "list-title mono",
                        children: "Commits"
                    }, void 0, false, {
                        fileName: "[project]/frontend/components/viewer/CommitList.tsx",
                        lineNumber: 31,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$26$2e$6$2e$5_react$2d$dom$40$19$2e$3$2e$1_react$40$19$2e$3$2e$1_$5f$react$40$19$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "list-count mono",
                        children: [
                            commits.length,
                            commits.length === total ? "" : ` / ${total}`,
                            " · newest first"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/frontend/components/viewer/CommitList.tsx",
                        lineNumber: 32,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/frontend/components/viewer/CommitList.tsx",
                lineNumber: 30,
                columnNumber: 7
            }, this),
            commits.map((commit)=>{
                const branch = commit.envelope.branch;
                const color = colors.get(branch) ?? "#57564F";
                const authorLabel = labels[commit.envelope.author.toLowerCase()] ?? null;
                const invalid = commit.status === "invalid";
                const locked = commit.locked;
                const summary = commit.body?.summary ?? null;
                const badge = invalid ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$26$2e$6$2e$5_react$2d$dom$40$19$2e$3$2e$1_react$40$19$2e$3$2e$1_$5f$react$40$19$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: "badge badge-invalid",
                    children: [
                        "invalid · ",
                        (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$lib$2f$format$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["reasonLabel"])(commit.reason)
                    ]
                }, void 0, true, {
                    fileName: "[project]/frontend/components/viewer/CommitList.tsx",
                    lineNumber: 46,
                    columnNumber: 11
                }, this) : locked ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$26$2e$6$2e$5_react$2d$dom$40$19$2e$3$2e$1_react$40$19$2e$3$2e$1_$5f$react$40$19$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: "badge badge-locked",
                    children: "sealed"
                }, void 0, false, {
                    fileName: "[project]/frontend/components/viewer/CommitList.tsx",
                    lineNumber: 48,
                    columnNumber: 11
                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$26$2e$6$2e$5_react$2d$dom$40$19$2e$3$2e$1_react$40$19$2e$3$2e$1_$5f$react$40$19$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: "badge badge-verified",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$26$2e$6$2e$5_react$2d$dom$40$19$2e$3$2e$1_react$40$19$2e$3$2e$1_$5f$react$40$19$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$components$2f$Icon$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            name: "i-check",
                            className: "ic ic-check"
                        }, void 0, false, {
                            fileName: "[project]/frontend/components/viewer/CommitList.tsx",
                            lineNumber: 51,
                            columnNumber: 13
                        }, this),
                        "verified"
                    ]
                }, void 0, true, {
                    fileName: "[project]/frontend/components/viewer/CommitList.tsx",
                    lineNumber: 50,
                    columnNumber: 11
                }, this);
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$26$2e$6$2e$5_react$2d$dom$40$19$2e$3$2e$1_react$40$19$2e$3$2e$1_$5f$react$40$19$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    className: `crow${invalid ? " is-invalid" : ""}${locked ? " is-locked" : ""}${selectedId === commit.id ? " is-on" : ""}${enterIds.has(commit.id) ? " enter" : ""}`,
                    type: "button",
                    onClick: ()=>onSelect(commit.id),
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$26$2e$6$2e$5_react$2d$dom$40$19$2e$3$2e$1_react$40$19$2e$3$2e$1_$5f$react$40$19$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "crow-gutter",
                            style: {
                                "--c": color
                            },
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$26$2e$6$2e$5_react$2d$dom$40$19$2e$3$2e$1_react$40$19$2e$3$2e$1_$5f$react$40$19$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "crow-dot"
                            }, void 0, false, {
                                fileName: "[project]/frontend/components/viewer/CommitList.tsx",
                                lineNumber: 65,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/frontend/components/viewer/CommitList.tsx",
                            lineNumber: 64,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$26$2e$6$2e$5_react$2d$dom$40$19$2e$3$2e$1_react$40$19$2e$3$2e$1_$5f$react$40$19$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "crow-main",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$26$2e$6$2e$5_react$2d$dom$40$19$2e$3$2e$1_react$40$19$2e$3$2e$1_$5f$react$40$19$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "crow-line1",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$26$2e$6$2e$5_react$2d$dom$40$19$2e$3$2e$1_react$40$19$2e$3$2e$1_$5f$react$40$19$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: `tag kind-${commit.envelope.kind}`,
                                            children: commit.envelope.kind
                                        }, void 0, false, {
                                            fileName: "[project]/frontend/components/viewer/CommitList.tsx",
                                            lineNumber: 69,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$26$2e$6$2e$5_react$2d$dom$40$19$2e$3$2e$1_react$40$19$2e$3$2e$1_$5f$react$40$19$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "crow-branch mono",
                                            children: branch
                                        }, void 0, false, {
                                            fileName: "[project]/frontend/components/viewer/CommitList.tsx",
                                            lineNumber: 70,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$26$2e$6$2e$5_react$2d$dom$40$19$2e$3$2e$1_react$40$19$2e$3$2e$1_$5f$react$40$19$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "crow-spacer"
                                        }, void 0, false, {
                                            fileName: "[project]/frontend/components/viewer/CommitList.tsx",
                                            lineNumber: 71,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$26$2e$6$2e$5_react$2d$dom$40$19$2e$3$2e$1_react$40$19$2e$3$2e$1_$5f$react$40$19$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "crow-time mono",
                                            children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$lib$2f$format$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["timeAgo"])(commit.envelope.ts, nowSeconds)
                                        }, void 0, false, {
                                            fileName: "[project]/frontend/components/viewer/CommitList.tsx",
                                            lineNumber: 72,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/frontend/components/viewer/CommitList.tsx",
                                    lineNumber: 68,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$26$2e$6$2e$5_react$2d$dom$40$19$2e$3$2e$1_react$40$19$2e$3$2e$1_$5f$react$40$19$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "crow-summary",
                                    children: summary ?? (invalid ? "Body sealed — verification failed" : "Body sealed — group key required")
                                }, void 0, false, {
                                    fileName: "[project]/frontend/components/viewer/CommitList.tsx",
                                    lineNumber: 74,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$26$2e$6$2e$5_react$2d$dom$40$19$2e$3$2e$1_react$40$19$2e$3$2e$1_$5f$react$40$19$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "crow-line3 mono",
                                    children: [
                                        authorLabel !== null ? `${authorLabel} · ` : "",
                                        (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$lib$2f$format$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["shortAddress"])(commit.envelope.author),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$26$2e$6$2e$5_react$2d$dom$40$19$2e$3$2e$1_react$40$19$2e$3$2e$1_$5f$react$40$19$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "crow-agent",
                                            children: [
                                                "via ",
                                                commit.envelope.agent
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/frontend/components/viewer/CommitList.tsx",
                                            lineNumber: 83,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/frontend/components/viewer/CommitList.tsx",
                                    lineNumber: 80,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/frontend/components/viewer/CommitList.tsx",
                            lineNumber: 67,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$26$2e$6$2e$5_react$2d$dom$40$19$2e$3$2e$1_react$40$19$2e$3$2e$1_$5f$react$40$19$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "crow-badge",
                            children: badge
                        }, void 0, false, {
                            fileName: "[project]/frontend/components/viewer/CommitList.tsx",
                            lineNumber: 86,
                            columnNumber: 13
                        }, this)
                    ]
                }, commit.id, true, {
                    fileName: "[project]/frontend/components/viewer/CommitList.tsx",
                    lineNumber: 56,
                    columnNumber: 11
                }, this);
            })
        ]
    }, void 0, true, {
        fileName: "[project]/frontend/components/viewer/CommitList.tsx",
        lineNumber: 29,
        columnNumber: 5
    }, this);
}
_c = CommitList;
var _c;
__turbopack_context__.k.register(_c, "CommitList");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/frontend/components/viewer/ConnectBar.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ConnectBar
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$26$2e$6$2e$5_react$2d$dom$40$19$2e$3$2e$1_react$40$19$2e$3$2e$1_$5f$react$40$19$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.4.2_@types+node@26.6.5_react-dom@19.3.1_react@19.3.1__react@19.3.1/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
"use client";
;
function ConnectBar({ mode, onMode, repoInput, setRepoInput, keyInput, setKeyInput, onConnect, busy, status, error }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$26$2e$6$2e$5_react$2d$dom$40$19$2e$3$2e$1_react$40$19$2e$3$2e$1_$5f$react$40$19$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "connect card",
        "data-reveal": true,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$26$2e$6$2e$5_react$2d$dom$40$19$2e$3$2e$1_react$40$19$2e$3$2e$1_$5f$react$40$19$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$26$2e$6$2e$5_react$2d$dom$40$19$2e$3$2e$1_react$40$19$2e$3$2e$1_$5f$react$40$19$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "connect-fields",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$26$2e$6$2e$5_react$2d$dom$40$19$2e$3$2e$1_react$40$19$2e$3$2e$1_$5f$react$40$19$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                className: "field",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$26$2e$6$2e$5_react$2d$dom$40$19$2e$3$2e$1_react$40$19$2e$3$2e$1_$5f$react$40$19$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "field-label",
                                        children: "Repo id"
                                    }, void 0, false, {
                                        fileName: "[project]/frontend/components/viewer/ConnectBar.tsx",
                                        lineNumber: 35,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$26$2e$6$2e$5_react$2d$dom$40$19$2e$3$2e$1_react$40$19$2e$3$2e$1_$5f$react$40$19$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        className: "input mono",
                                        type: "text",
                                        value: repoInput,
                                        spellCheck: false,
                                        autoComplete: "off",
                                        onChange: (event)=>setRepoInput(event.target.value),
                                        onKeyDown: (event)=>{
                                            if (event.key === "Enter") {
                                                onConnect();
                                            }
                                        }
                                    }, void 0, false, {
                                        fileName: "[project]/frontend/components/viewer/ConnectBar.tsx",
                                        lineNumber: 36,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/frontend/components/viewer/ConnectBar.tsx",
                                lineNumber: 34,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$26$2e$6$2e$5_react$2d$dom$40$19$2e$3$2e$1_react$40$19$2e$3$2e$1_$5f$react$40$19$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                className: "field field-wide",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$26$2e$6$2e$5_react$2d$dom$40$19$2e$3$2e$1_react$40$19$2e$3$2e$1_$5f$react$40$19$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "field-label",
                                        children: "Group key or invite"
                                    }, void 0, false, {
                                        fileName: "[project]/frontend/components/viewer/ConnectBar.tsx",
                                        lineNumber: 51,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$26$2e$6$2e$5_react$2d$dom$40$19$2e$3$2e$1_react$40$19$2e$3$2e$1_$5f$react$40$19$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        className: "input mono",
                                        type: "password",
                                        value: keyInput,
                                        spellCheck: false,
                                        autoComplete: "off",
                                        onChange: (event)=>setKeyInput(event.target.value),
                                        onKeyDown: (event)=>{
                                            if (event.key === "Enter") {
                                                onConnect();
                                            }
                                        }
                                    }, void 0, false, {
                                        fileName: "[project]/frontend/components/viewer/ConnectBar.tsx",
                                        lineNumber: 52,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$26$2e$6$2e$5_react$2d$dom$40$19$2e$3$2e$1_react$40$19$2e$3$2e$1_$5f$react$40$19$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "field-hint",
                                        children: "kept in memory only"
                                    }, void 0, false, {
                                        fileName: "[project]/frontend/components/viewer/ConnectBar.tsx",
                                        lineNumber: 65,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/frontend/components/viewer/ConnectBar.tsx",
                                lineNumber: 50,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$26$2e$6$2e$5_react$2d$dom$40$19$2e$3$2e$1_react$40$19$2e$3$2e$1_$5f$react$40$19$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                className: "btn btn-ink connect-btn",
                                type: "button",
                                onClick: onConnect,
                                disabled: busy,
                                children: busy ? "Reading…" : mode === "demo" ? "Rebuild" : "Connect"
                            }, void 0, false, {
                                fileName: "[project]/frontend/components/viewer/ConnectBar.tsx",
                                lineNumber: 67,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/frontend/components/viewer/ConnectBar.tsx",
                        lineNumber: 33,
                        columnNumber: 9
                    }, this),
                    error !== null ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$26$2e$6$2e$5_react$2d$dom$40$19$2e$3$2e$1_react$40$19$2e$3$2e$1_$5f$react$40$19$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "notice notice-bad",
                        style: {
                            marginTop: 14
                        },
                        children: error
                    }, void 0, false, {
                        fileName: "[project]/frontend/components/viewer/ConnectBar.tsx",
                        lineNumber: 72,
                        columnNumber: 11
                    }, this) : null
                ]
            }, void 0, true, {
                fileName: "[project]/frontend/components/viewer/ConnectBar.tsx",
                lineNumber: 32,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$26$2e$6$2e$5_react$2d$dom$40$19$2e$3$2e$1_react$40$19$2e$3$2e$1_$5f$react$40$19$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "connect-side",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$26$2e$6$2e$5_react$2d$dom$40$19$2e$3$2e$1_react$40$19$2e$3$2e$1_$5f$react$40$19$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "seg",
                        role: "group",
                        "aria-label": "Data source",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$26$2e$6$2e$5_react$2d$dom$40$19$2e$3$2e$1_react$40$19$2e$3$2e$1_$5f$react$40$19$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                className: `seg-opt${mode === "demo" ? " is-on" : ""}`,
                                type: "button",
                                onClick: ()=>onMode("demo"),
                                children: "Demo dataset"
                            }, void 0, false, {
                                fileName: "[project]/frontend/components/viewer/ConnectBar.tsx",
                                lineNumber: 79,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$26$2e$6$2e$5_react$2d$dom$40$19$2e$3$2e$1_react$40$19$2e$3$2e$1_$5f$react$40$19$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                className: `seg-opt${mode === "live" ? " is-on" : ""}`,
                                type: "button",
                                onClick: ()=>onMode("live"),
                                children: "Live · Arkiv"
                            }, void 0, false, {
                                fileName: "[project]/frontend/components/viewer/ConnectBar.tsx",
                                lineNumber: 86,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/frontend/components/viewer/ConnectBar.tsx",
                        lineNumber: 78,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$26$2e$6$2e$5_react$2d$dom$40$19$2e$3$2e$1_react$40$19$2e$3$2e$1_$5f$react$40$19$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "connect-status",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$26$2e$6$2e$5_react$2d$dom$40$19$2e$3$2e$1_react$40$19$2e$3$2e$1_$5f$react$40$19$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "pulse-dot"
                            }, void 0, false, {
                                fileName: "[project]/frontend/components/viewer/ConnectBar.tsx",
                                lineNumber: 95,
                                columnNumber: 11
                            }, this),
                            status
                        ]
                    }, void 0, true, {
                        fileName: "[project]/frontend/components/viewer/ConnectBar.tsx",
                        lineNumber: 94,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/frontend/components/viewer/ConnectBar.tsx",
                lineNumber: 77,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/frontend/components/viewer/ConnectBar.tsx",
        lineNumber: 31,
        columnNumber: 5
    }, this);
}
_c = ConnectBar;
var _c;
__turbopack_context__.k.register(_c, "ConnectBar");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/frontend/components/viewer/DetailPanel.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>DetailPanel
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$26$2e$6$2e$5_react$2d$dom$40$19$2e$3$2e$1_react$40$19$2e$3$2e$1_$5f$react$40$19$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.4.2_@types+node@26.6.5_react-dom@19.3.1_react@19.3.1__react@19.3.1/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$components$2f$CopyButton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/components/CopyButton.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$components$2f$Icon$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/components/Icon.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$components$2f$viewer$2f$Markdown$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/components/viewer/Markdown.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$lib$2f$format$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/lib/format.ts [app-client] (ecmascript)");
"use client";
;
;
;
;
;
function DetailPanel({ commit, repo, labels, timing }) {
    if (commit === null) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$26$2e$6$2e$5_react$2d$dom$40$19$2e$3$2e$1_react$40$19$2e$3$2e$1_$5f$react$40$19$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("aside", {
            className: "detail",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$26$2e$6$2e$5_react$2d$dom$40$19$2e$3$2e$1_react$40$19$2e$3$2e$1_$5f$react$40$19$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "detail-head",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$26$2e$6$2e$5_react$2d$dom$40$19$2e$3$2e$1_react$40$19$2e$3$2e$1_$5f$react$40$19$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "badge badge-locked",
                        children: "no selection"
                    }, void 0, false, {
                        fileName: "[project]/frontend/components/viewer/DetailPanel.tsx",
                        lineNumber: 21,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/frontend/components/viewer/DetailPanel.tsx",
                    lineNumber: 20,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$26$2e$6$2e$5_react$2d$dom$40$19$2e$3$2e$1_react$40$19$2e$3$2e$1_$5f$react$40$19$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                    className: "detail-title",
                    children: "Select a commit"
                }, void 0, false, {
                    fileName: "[project]/frontend/components/viewer/DetailPanel.tsx",
                    lineNumber: 23,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$26$2e$6$2e$5_react$2d$dom$40$19$2e$3$2e$1_react$40$19$2e$3$2e$1_$5f$react$40$19$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "detail-time mono",
                    children: "click a node in the graph or a row in the list to inspect it"
                }, void 0, false, {
                    fileName: "[project]/frontend/components/viewer/DetailPanel.tsx",
                    lineNumber: 24,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/frontend/components/viewer/DetailPanel.tsx",
            lineNumber: 19,
            columnNumber: 7
        }, this);
    }
    const envelope = commit.envelope;
    const invalid = commit.status === "invalid";
    const locked = commit.locked;
    const authorLabel = labels[envelope.author.toLowerCase()] ?? null;
    const authorDisplay = `${authorLabel !== null ? `${authorLabel} · ` : ""}${(0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$lib$2f$format$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["shortAddress"])(envelope.author)}`;
    const ownerLabel = labels[commit.owner.toLowerCase()] ?? null;
    const ownerDisplay = `${ownerLabel !== null ? `${ownerLabel} · ` : ""}${(0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$lib$2f$format$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["shortAddress"])(commit.owner)}`;
    const remainingSeconds = timing === null ? 0 : (commit.expiresAtBlock - timing.currentBlock) * timing.blockDuration;
    const expiresAbs = timing === null ? null : new Date((timing.currentBlockTime + remainingSeconds) * 1000);
    const badge = invalid ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$26$2e$6$2e$5_react$2d$dom$40$19$2e$3$2e$1_react$40$19$2e$3$2e$1_$5f$react$40$19$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
        className: "badge badge-invalid",
        children: [
            "invalid · ",
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$lib$2f$format$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["reasonLabel"])(commit.reason)
        ]
    }, void 0, true, {
        fileName: "[project]/frontend/components/viewer/DetailPanel.tsx",
        lineNumber: 45,
        columnNumber: 5
    }, this) : locked ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$26$2e$6$2e$5_react$2d$dom$40$19$2e$3$2e$1_react$40$19$2e$3$2e$1_$5f$react$40$19$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
        className: "badge badge-locked",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$26$2e$6$2e$5_react$2d$dom$40$19$2e$3$2e$1_react$40$19$2e$3$2e$1_$5f$react$40$19$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$components$2f$Icon$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                name: "i-lock",
                className: "ic ic-check"
            }, void 0, false, {
                fileName: "[project]/frontend/components/viewer/DetailPanel.tsx",
                lineNumber: 48,
                columnNumber: 7
            }, this),
            "sealed"
        ]
    }, void 0, true, {
        fileName: "[project]/frontend/components/viewer/DetailPanel.tsx",
        lineNumber: 47,
        columnNumber: 5
    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$26$2e$6$2e$5_react$2d$dom$40$19$2e$3$2e$1_react$40$19$2e$3$2e$1_$5f$react$40$19$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
        className: "badge badge-verified",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$26$2e$6$2e$5_react$2d$dom$40$19$2e$3$2e$1_react$40$19$2e$3$2e$1_$5f$react$40$19$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$components$2f$Icon$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                name: "i-check",
                className: "ic ic-check"
            }, void 0, false, {
                fileName: "[project]/frontend/components/viewer/DetailPanel.tsx",
                lineNumber: 53,
                columnNumber: 7
            }, this),
            "verified"
        ]
    }, void 0, true, {
        fileName: "[project]/frontend/components/viewer/DetailPanel.tsx",
        lineNumber: 52,
        columnNumber: 5
    }, this);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$26$2e$6$2e$5_react$2d$dom$40$19$2e$3$2e$1_react$40$19$2e$3$2e$1_$5f$react$40$19$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("aside", {
        className: "detail",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$26$2e$6$2e$5_react$2d$dom$40$19$2e$3$2e$1_react$40$19$2e$3$2e$1_$5f$react$40$19$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "detail-head",
                children: [
                    badge,
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$26$2e$6$2e$5_react$2d$dom$40$19$2e$3$2e$1_react$40$19$2e$3$2e$1_$5f$react$40$19$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "detail-checks mono",
                        children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$lib$2f$format$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["checksSummary"])(commit.checks)
                    }, void 0, false, {
                        fileName: "[project]/frontend/components/viewer/DetailPanel.tsx",
                        lineNumber: 62,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/frontend/components/viewer/DetailPanel.tsx",
                lineNumber: 60,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$26$2e$6$2e$5_react$2d$dom$40$19$2e$3$2e$1_react$40$19$2e$3$2e$1_$5f$react$40$19$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "detail-title-row",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$26$2e$6$2e$5_react$2d$dom$40$19$2e$3$2e$1_react$40$19$2e$3$2e$1_$5f$react$40$19$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: `tag kind-${envelope.kind}`,
                        children: envelope.kind
                    }, void 0, false, {
                        fileName: "[project]/frontend/components/viewer/DetailPanel.tsx",
                        lineNumber: 66,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$26$2e$6$2e$5_react$2d$dom$40$19$2e$3$2e$1_react$40$19$2e$3$2e$1_$5f$react$40$19$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "detail-branch mono",
                        children: [
                            envelope.branch,
                            authorLabel !== null ? ` · ${authorLabel}` : ""
                        ]
                    }, void 0, true, {
                        fileName: "[project]/frontend/components/viewer/DetailPanel.tsx",
                        lineNumber: 67,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/frontend/components/viewer/DetailPanel.tsx",
                lineNumber: 65,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$26$2e$6$2e$5_react$2d$dom$40$19$2e$3$2e$1_react$40$19$2e$3$2e$1_$5f$react$40$19$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                className: "detail-title",
                children: commit.body !== null ? commit.body.summary : invalid ? "Body sealed — verification failed" : "Body sealed — group key required"
            }, void 0, false, {
                fileName: "[project]/frontend/components/viewer/DetailPanel.tsx",
                lineNumber: 73,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$26$2e$6$2e$5_react$2d$dom$40$19$2e$3$2e$1_react$40$19$2e$3$2e$1_$5f$react$40$19$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "detail-time mono",
                children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$lib$2f$format$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["absTime"])(envelope.ts)
            }, void 0, false, {
                fileName: "[project]/frontend/components/viewer/DetailPanel.tsx",
                lineNumber: 80,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$26$2e$6$2e$5_react$2d$dom$40$19$2e$3$2e$1_react$40$19$2e$3$2e$1_$5f$react$40$19$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("dl", {
                className: "kv kv-detail",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$26$2e$6$2e$5_react$2d$dom$40$19$2e$3$2e$1_react$40$19$2e$3$2e$1_$5f$react$40$19$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "kv-row",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$26$2e$6$2e$5_react$2d$dom$40$19$2e$3$2e$1_react$40$19$2e$3$2e$1_$5f$react$40$19$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("dt", {
                                children: "Author"
                            }, void 0, false, {
                                fileName: "[project]/frontend/components/viewer/DetailPanel.tsx",
                                lineNumber: 86,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$26$2e$6$2e$5_react$2d$dom$40$19$2e$3$2e$1_react$40$19$2e$3$2e$1_$5f$react$40$19$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("dd", {
                                className: "mono",
                                children: authorDisplay
                            }, void 0, false, {
                                fileName: "[project]/frontend/components/viewer/DetailPanel.tsx",
                                lineNumber: 87,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/frontend/components/viewer/DetailPanel.tsx",
                        lineNumber: 85,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$26$2e$6$2e$5_react$2d$dom$40$19$2e$3$2e$1_react$40$19$2e$3$2e$1_$5f$react$40$19$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "kv-row",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$26$2e$6$2e$5_react$2d$dom$40$19$2e$3$2e$1_react$40$19$2e$3$2e$1_$5f$react$40$19$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("dt", {
                                children: "Agent"
                            }, void 0, false, {
                                fileName: "[project]/frontend/components/viewer/DetailPanel.tsx",
                                lineNumber: 90,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$26$2e$6$2e$5_react$2d$dom$40$19$2e$3$2e$1_react$40$19$2e$3$2e$1_$5f$react$40$19$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("dd", {
                                className: "mono",
                                children: envelope.agent
                            }, void 0, false, {
                                fileName: "[project]/frontend/components/viewer/DetailPanel.tsx",
                                lineNumber: 91,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/frontend/components/viewer/DetailPanel.tsx",
                        lineNumber: 89,
                        columnNumber: 9
                    }, this),
                    invalid ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$26$2e$6$2e$5_react$2d$dom$40$19$2e$3$2e$1_react$40$19$2e$3$2e$1_$5f$react$40$19$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "kv-row",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$26$2e$6$2e$5_react$2d$dom$40$19$2e$3$2e$1_react$40$19$2e$3$2e$1_$5f$react$40$19$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("dt", {
                                children: "Entity owner"
                            }, void 0, false, {
                                fileName: "[project]/frontend/components/viewer/DetailPanel.tsx",
                                lineNumber: 95,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$26$2e$6$2e$5_react$2d$dom$40$19$2e$3$2e$1_react$40$19$2e$3$2e$1_$5f$react$40$19$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("dd", {
                                className: "mono",
                                children: ownerDisplay
                            }, void 0, false, {
                                fileName: "[project]/frontend/components/viewer/DetailPanel.tsx",
                                lineNumber: 96,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/frontend/components/viewer/DetailPanel.tsx",
                        lineNumber: 94,
                        columnNumber: 11
                    }, this) : null,
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$26$2e$6$2e$5_react$2d$dom$40$19$2e$3$2e$1_react$40$19$2e$3$2e$1_$5f$react$40$19$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "kv-row",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$26$2e$6$2e$5_react$2d$dom$40$19$2e$3$2e$1_react$40$19$2e$3$2e$1_$5f$react$40$19$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("dt", {
                                children: "Block"
                            }, void 0, false, {
                                fileName: "[project]/frontend/components/viewer/DetailPanel.tsx",
                                lineNumber: 100,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$26$2e$6$2e$5_react$2d$dom$40$19$2e$3$2e$1_react$40$19$2e$3$2e$1_$5f$react$40$19$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("dd", {
                                className: "mono",
                                children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$lib$2f$format$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatBlock"])(commit.createdAtBlock)
                            }, void 0, false, {
                                fileName: "[project]/frontend/components/viewer/DetailPanel.tsx",
                                lineNumber: 101,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/frontend/components/viewer/DetailPanel.tsx",
                        lineNumber: 99,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$26$2e$6$2e$5_react$2d$dom$40$19$2e$3$2e$1_react$40$19$2e$3$2e$1_$5f$react$40$19$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "kv-row",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$26$2e$6$2e$5_react$2d$dom$40$19$2e$3$2e$1_react$40$19$2e$3$2e$1_$5f$react$40$19$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("dt", {
                                children: "Expires"
                            }, void 0, false, {
                                fileName: "[project]/frontend/components/viewer/DetailPanel.tsx",
                                lineNumber: 104,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$26$2e$6$2e$5_react$2d$dom$40$19$2e$3$2e$1_react$40$19$2e$3$2e$1_$5f$react$40$19$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("dd", {
                                className: "mono",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$26$2e$6$2e$5_react$2d$dom$40$19$2e$3$2e$1_react$40$19$2e$3$2e$1_$5f$react$40$19$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$components$2f$Icon$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                        name: "i-clock",
                                        className: "ic ic-inline"
                                    }, void 0, false, {
                                        fileName: "[project]/frontend/components/viewer/DetailPanel.tsx",
                                        lineNumber: 106,
                                        columnNumber: 13
                                    }, this),
                                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$lib$2f$format$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["countdown"])(remainingSeconds),
                                    expiresAbs !== null ? ` · ${expiresAbs.toLocaleDateString("en-GB", {
                                        day: "2-digit",
                                        month: "short",
                                        year: "numeric",
                                        timeZone: "UTC"
                                    })}` : ""
                                ]
                            }, void 0, true, {
                                fileName: "[project]/frontend/components/viewer/DetailPanel.tsx",
                                lineNumber: 105,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/frontend/components/viewer/DetailPanel.tsx",
                        lineNumber: 103,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/frontend/components/viewer/DetailPanel.tsx",
                lineNumber: 84,
                columnNumber: 7
            }, this),
            commit.body !== null && commit.body.tags.length > 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$26$2e$6$2e$5_react$2d$dom$40$19$2e$3$2e$1_react$40$19$2e$3$2e$1_$5f$react$40$19$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "detail-tags",
                children: commit.body.tags.map((tag)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$26$2e$6$2e$5_react$2d$dom$40$19$2e$3$2e$1_react$40$19$2e$3$2e$1_$5f$react$40$19$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "chip chip-sm",
                        children: tag
                    }, tag, false, {
                        fileName: "[project]/frontend/components/viewer/DetailPanel.tsx",
                        lineNumber: 123,
                        columnNumber: 13
                    }, this))
            }, void 0, false, {
                fileName: "[project]/frontend/components/viewer/DetailPanel.tsx",
                lineNumber: 121,
                columnNumber: 9
            }, this) : null,
            invalid ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$26$2e$6$2e$5_react$2d$dom$40$19$2e$3$2e$1_react$40$19$2e$3$2e$1_$5f$react$40$19$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "notice notice-bad",
                children: [
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$lib$2f$format$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["reasonLabel"])(commit.reason),
                    " — ",
                    commit.detail ?? "verification failed",
                    ". The body was never decrypted."
                ]
            }, void 0, true, {
                fileName: "[project]/frontend/components/viewer/DetailPanel.tsx",
                lineNumber: 131,
                columnNumber: 9
            }, this) : null,
            locked && !invalid ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$26$2e$6$2e$5_react$2d$dom$40$19$2e$3$2e$1_react$40$19$2e$3$2e$1_$5f$react$40$19$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "notice",
                children: "Every signature checks out, but the body stays sealed until a group key is provided. Add the invite key above to decrypt."
            }, void 0, false, {
                fileName: "[project]/frontend/components/viewer/DetailPanel.tsx",
                lineNumber: 138,
                columnNumber: 9
            }, this) : null,
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$26$2e$6$2e$5_react$2d$dom$40$19$2e$3$2e$1_react$40$19$2e$3$2e$1_$5f$react$40$19$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "proof",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$26$2e$6$2e$5_react$2d$dom$40$19$2e$3$2e$1_react$40$19$2e$3$2e$1_$5f$react$40$19$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "proof-label",
                        children: "Proof"
                    }, void 0, false, {
                        fileName: "[project]/frontend/components/viewer/DetailPanel.tsx",
                        lineNumber: 145,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$26$2e$6$2e$5_react$2d$dom$40$19$2e$3$2e$1_react$40$19$2e$3$2e$1_$5f$react$40$19$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "proof-row",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$26$2e$6$2e$5_react$2d$dom$40$19$2e$3$2e$1_react$40$19$2e$3$2e$1_$5f$react$40$19$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "proof-key",
                                children: "commit hash"
                            }, void 0, false, {
                                fileName: "[project]/frontend/components/viewer/DetailPanel.tsx",
                                lineNumber: 147,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$26$2e$6$2e$5_react$2d$dom$40$19$2e$3$2e$1_react$40$19$2e$3$2e$1_$5f$react$40$19$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "proof-val mono",
                                children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$lib$2f$format$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["shortHex"])(envelope.commitHash, 10, 8)
                            }, void 0, false, {
                                fileName: "[project]/frontend/components/viewer/DetailPanel.tsx",
                                lineNumber: 148,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$26$2e$6$2e$5_react$2d$dom$40$19$2e$3$2e$1_react$40$19$2e$3$2e$1_$5f$react$40$19$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$components$2f$CopyButton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                text: envelope.commitHash,
                                label: "Copy commit hash"
                            }, void 0, false, {
                                fileName: "[project]/frontend/components/viewer/DetailPanel.tsx",
                                lineNumber: 149,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/frontend/components/viewer/DetailPanel.tsx",
                        lineNumber: 146,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$26$2e$6$2e$5_react$2d$dom$40$19$2e$3$2e$1_react$40$19$2e$3$2e$1_$5f$react$40$19$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "proof-row",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$26$2e$6$2e$5_react$2d$dom$40$19$2e$3$2e$1_react$40$19$2e$3$2e$1_$5f$react$40$19$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "proof-key",
                                children: "parent"
                            }, void 0, false, {
                                fileName: "[project]/frontend/components/viewer/DetailPanel.tsx",
                                lineNumber: 152,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$26$2e$6$2e$5_react$2d$dom$40$19$2e$3$2e$1_react$40$19$2e$3$2e$1_$5f$react$40$19$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "proof-val mono",
                                children: envelope.parent === null ? "— root" : (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$lib$2f$format$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["shortHex"])(envelope.parent, 10, 8)
                            }, void 0, false, {
                                fileName: "[project]/frontend/components/viewer/DetailPanel.tsx",
                                lineNumber: 153,
                                columnNumber: 11
                            }, this),
                            envelope.parent !== null ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$26$2e$6$2e$5_react$2d$dom$40$19$2e$3$2e$1_react$40$19$2e$3$2e$1_$5f$react$40$19$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$components$2f$CopyButton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                text: envelope.parent,
                                label: "Copy parent hash"
                            }, void 0, false, {
                                fileName: "[project]/frontend/components/viewer/DetailPanel.tsx",
                                lineNumber: 157,
                                columnNumber: 13
                            }, this) : null
                        ]
                    }, void 0, true, {
                        fileName: "[project]/frontend/components/viewer/DetailPanel.tsx",
                        lineNumber: 151,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$26$2e$6$2e$5_react$2d$dom$40$19$2e$3$2e$1_react$40$19$2e$3$2e$1_$5f$react$40$19$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "proof-row",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$26$2e$6$2e$5_react$2d$dom$40$19$2e$3$2e$1_react$40$19$2e$3$2e$1_$5f$react$40$19$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "proof-key",
                                children: "entity key"
                            }, void 0, false, {
                                fileName: "[project]/frontend/components/viewer/DetailPanel.tsx",
                                lineNumber: 161,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$26$2e$6$2e$5_react$2d$dom$40$19$2e$3$2e$1_react$40$19$2e$3$2e$1_$5f$react$40$19$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "proof-val mono",
                                children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$lib$2f$format$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["shortHex"])(commit.entityKey, 8, 8)
                            }, void 0, false, {
                                fileName: "[project]/frontend/components/viewer/DetailPanel.tsx",
                                lineNumber: 162,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$26$2e$6$2e$5_react$2d$dom$40$19$2e$3$2e$1_react$40$19$2e$3$2e$1_$5f$react$40$19$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$components$2f$CopyButton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                text: commit.entityKey,
                                label: "Copy entity key"
                            }, void 0, false, {
                                fileName: "[project]/frontend/components/viewer/DetailPanel.tsx",
                                lineNumber: 163,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/frontend/components/viewer/DetailPanel.tsx",
                        lineNumber: 160,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$26$2e$6$2e$5_react$2d$dom$40$19$2e$3$2e$1_react$40$19$2e$3$2e$1_$5f$react$40$19$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "proof-row",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$26$2e$6$2e$5_react$2d$dom$40$19$2e$3$2e$1_react$40$19$2e$3$2e$1_$5f$react$40$19$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "proof-key",
                                children: "signature"
                            }, void 0, false, {
                                fileName: "[project]/frontend/components/viewer/DetailPanel.tsx",
                                lineNumber: 166,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$26$2e$6$2e$5_react$2d$dom$40$19$2e$3$2e$1_react$40$19$2e$3$2e$1_$5f$react$40$19$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "proof-val mono",
                                children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$lib$2f$format$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["shortHex"])(envelope.sig, 8, 6)
                            }, void 0, false, {
                                fileName: "[project]/frontend/components/viewer/DetailPanel.tsx",
                                lineNumber: 167,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$26$2e$6$2e$5_react$2d$dom$40$19$2e$3$2e$1_react$40$19$2e$3$2e$1_$5f$react$40$19$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$components$2f$CopyButton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                text: envelope.sig,
                                label: "Copy signature"
                            }, void 0, false, {
                                fileName: "[project]/frontend/components/viewer/DetailPanel.tsx",
                                lineNumber: 168,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/frontend/components/viewer/DetailPanel.tsx",
                        lineNumber: 165,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/frontend/components/viewer/DetailPanel.tsx",
                lineNumber: 144,
                columnNumber: 7
            }, this),
            commit.body !== null ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$26$2e$6$2e$5_react$2d$dom$40$19$2e$3$2e$1_react$40$19$2e$3$2e$1_$5f$react$40$19$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "detail-body",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$26$2e$6$2e$5_react$2d$dom$40$19$2e$3$2e$1_react$40$19$2e$3$2e$1_$5f$react$40$19$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "proof-label",
                        children: "Details"
                    }, void 0, false, {
                        fileName: "[project]/frontend/components/viewer/DetailPanel.tsx",
                        lineNumber: 174,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$26$2e$6$2e$5_react$2d$dom$40$19$2e$3$2e$1_react$40$19$2e$3$2e$1_$5f$react$40$19$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$components$2f$viewer$2f$Markdown$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        text: commit.body.details
                    }, void 0, false, {
                        fileName: "[project]/frontend/components/viewer/DetailPanel.tsx",
                        lineNumber: 175,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/frontend/components/viewer/DetailPanel.tsx",
                lineNumber: 173,
                columnNumber: 9
            }, this) : null
        ]
    }, void 0, true, {
        fileName: "[project]/frontend/components/viewer/DetailPanel.tsx",
        lineNumber: 59,
        columnNumber: 5
    }, this);
}
_c = DetailPanel;
var _c;
__turbopack_context__.k.register(_c, "DetailPanel");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/frontend/components/viewer/Markdown.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Markdown
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$26$2e$6$2e$5_react$2d$dom$40$19$2e$3$2e$1_react$40$19$2e$3$2e$1_$5f$react$40$19$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.4.2_@types+node@26.6.5_react-dom@19.3.1_react@19.3.1__react@19.3.1/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
;
function isBlockStart(line) {
    const trimmed = line.trimStart();
    return trimmed.startsWith("#") || trimmed.startsWith("```") || trimmed.startsWith("- ") || /^\d+\.\s/.test(trimmed);
}
function parseBlocks(markdown) {
    const lines = markdown.split("\n");
    const blocks = [];
    let i = 0;
    while(i < lines.length){
        const line = lines[i] ?? "";
        if (line.trim() === "") {
            i += 1;
            continue;
        }
        if (line.startsWith("```")) {
            const code = [];
            i += 1;
            while(i < lines.length && !(lines[i] ?? "").startsWith("```")){
                code.push(lines[i] ?? "");
                i += 1;
            }
            i += 1;
            blocks.push({
                type: "pre",
                code: code.join("\n")
            });
            continue;
        }
        const heading = /^#{2,4}\s+(.*)$/.exec(line);
        if (heading !== null) {
            blocks.push({
                type: "heading",
                text: heading[1] ?? ""
            });
            i += 1;
            continue;
        }
        if (/^-\s+/.test(line)) {
            const items = [];
            while(i < lines.length && /^-\s+/.test(lines[i] ?? "")){
                items.push((lines[i] ?? "").replace(/^-\s+/, ""));
                i += 1;
            }
            blocks.push({
                type: "ul",
                items
            });
            continue;
        }
        if (/^\d+\.\s+/.test(line)) {
            const items = [];
            while(i < lines.length && /^\d+\.\s+/.test(lines[i] ?? "")){
                items.push((lines[i] ?? "").replace(/^\d+\.\s+/, ""));
                i += 1;
            }
            blocks.push({
                type: "ol",
                items
            });
            continue;
        }
        const paragraph = [
            line
        ];
        i += 1;
        while(i < lines.length && (lines[i] ?? "").trim() !== "" && !isBlockStart(lines[i] ?? "")){
            paragraph.push(lines[i] ?? "");
            i += 1;
        }
        blocks.push({
            type: "p",
            text: paragraph.join(" ")
        });
    }
    return blocks;
}
function inline(text) {
    const parts = text.split("`");
    return parts.map((part, index)=>index % 2 === 1 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$26$2e$6$2e$5_react$2d$dom$40$19$2e$3$2e$1_react$40$19$2e$3$2e$1_$5f$react$40$19$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("code", {
            children: part
        }, index, false, {
            fileName: "[project]/frontend/components/viewer/Markdown.tsx",
            lineNumber: 91,
            columnNumber: 23
        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$26$2e$6$2e$5_react$2d$dom$40$19$2e$3$2e$1_react$40$19$2e$3$2e$1_$5f$react$40$19$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
            children: part
        }, index, false, {
            fileName: "[project]/frontend/components/viewer/Markdown.tsx",
            lineNumber: 91,
            columnNumber: 57
        }, this));
}
function Markdown({ text }) {
    const blocks = parseBlocks(text);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$26$2e$6$2e$5_react$2d$dom$40$19$2e$3$2e$1_react$40$19$2e$3$2e$1_$5f$react$40$19$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "md",
        children: blocks.map((block, index)=>{
            switch(block.type){
                case "heading":
                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$26$2e$6$2e$5_react$2d$dom$40$19$2e$3$2e$1_react$40$19$2e$3$2e$1_$5f$react$40$19$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                        children: inline(block.text)
                    }, index, false, {
                        fileName: "[project]/frontend/components/viewer/Markdown.tsx",
                        lineNumber: 102,
                        columnNumber: 20
                    }, this);
                case "p":
                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$26$2e$6$2e$5_react$2d$dom$40$19$2e$3$2e$1_react$40$19$2e$3$2e$1_$5f$react$40$19$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        children: inline(block.text)
                    }, index, false, {
                        fileName: "[project]/frontend/components/viewer/Markdown.tsx",
                        lineNumber: 104,
                        columnNumber: 20
                    }, this);
                case "ul":
                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$26$2e$6$2e$5_react$2d$dom$40$19$2e$3$2e$1_react$40$19$2e$3$2e$1_$5f$react$40$19$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                        children: block.items.map((item, itemIndex)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$26$2e$6$2e$5_react$2d$dom$40$19$2e$3$2e$1_react$40$19$2e$3$2e$1_$5f$react$40$19$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                children: inline(item)
                            }, itemIndex, false, {
                                fileName: "[project]/frontend/components/viewer/Markdown.tsx",
                                lineNumber: 109,
                                columnNumber: 19
                            }, this))
                    }, index, false, {
                        fileName: "[project]/frontend/components/viewer/Markdown.tsx",
                        lineNumber: 107,
                        columnNumber: 15
                    }, this);
                case "ol":
                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$26$2e$6$2e$5_react$2d$dom$40$19$2e$3$2e$1_react$40$19$2e$3$2e$1_$5f$react$40$19$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ol", {
                        children: block.items.map((item, itemIndex)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$26$2e$6$2e$5_react$2d$dom$40$19$2e$3$2e$1_react$40$19$2e$3$2e$1_$5f$react$40$19$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                children: inline(item)
                            }, itemIndex, false, {
                                fileName: "[project]/frontend/components/viewer/Markdown.tsx",
                                lineNumber: 117,
                                columnNumber: 19
                            }, this))
                    }, index, false, {
                        fileName: "[project]/frontend/components/viewer/Markdown.tsx",
                        lineNumber: 115,
                        columnNumber: 15
                    }, this);
                case "pre":
                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$26$2e$6$2e$5_react$2d$dom$40$19$2e$3$2e$1_react$40$19$2e$3$2e$1_$5f$react$40$19$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("pre", {
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$26$2e$6$2e$5_react$2d$dom$40$19$2e$3$2e$1_react$40$19$2e$3$2e$1_$5f$react$40$19$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("code", {
                            children: block.code
                        }, void 0, false, {
                            fileName: "[project]/frontend/components/viewer/Markdown.tsx",
                            lineNumber: 124,
                            columnNumber: 17
                        }, this)
                    }, index, false, {
                        fileName: "[project]/frontend/components/viewer/Markdown.tsx",
                        lineNumber: 123,
                        columnNumber: 15
                    }, this);
            }
        })
    }, void 0, false, {
        fileName: "[project]/frontend/components/viewer/Markdown.tsx",
        lineNumber: 98,
        columnNumber: 5
    }, this);
}
_c = Markdown;
var _c;
__turbopack_context__.k.register(_c, "Markdown");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/frontend/components/viewer/ViewerSection.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ViewerSection
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$26$2e$6$2e$5_react$2d$dom$40$19$2e$3$2e$1_react$40$19$2e$3$2e$1_$5f$react$40$19$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.4.2_@types+node@26.6.5_react-dom@19.3.1_react@19.3.1__react@19.3.1/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$26$2e$6$2e$5_react$2d$dom$40$19$2e$3$2e$1_react$40$19$2e$3$2e$1_$5f$react$40$19$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.4.2_@types+node@26.6.5_react-dom@19.3.1_react@19.3.1__react@19.3.1/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$components$2f$viewer$2f$BranchRail$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/components/viewer/BranchRail.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$components$2f$viewer$2f$CommitGraph$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/components/viewer/CommitGraph.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$components$2f$viewer$2f$CommitList$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/components/viewer/CommitList.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$components$2f$viewer$2f$ConnectBar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/components/viewer/ConnectBar.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$components$2f$viewer$2f$DetailPanel$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/components/viewer/DetailPanel.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$components$2f$CopyButton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/components/CopyButton.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$components$2f$Icon$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/components/Icon.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$lib$2f$demo$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/lib/demo.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$lib$2f$live$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/lib/live.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$lib$2f$crypto$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/lib/crypto.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$lib$2f$graph$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/lib/graph.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$lib$2f$format$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/lib/format.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
;
;
;
;
;
;
;
function demoInvite() {
    const b64 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$lib$2f$crypto$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["bytesToBase64"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$lib$2f$demo$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["demoGroupKey"])()).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
    return `cogit1:${__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$lib$2f$demo$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEMO_REPO_ID"]}:${b64}`;
}
function useNow(intervalMs) {
    _s();
    const [now, setNow] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$26$2e$6$2e$5_react$2d$dom$40$19$2e$3$2e$1_react$40$19$2e$3$2e$1_$5f$react$40$19$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        "useNow.useState": ()=>Date.now()
    }["useNow.useState"]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$26$2e$6$2e$5_react$2d$dom$40$19$2e$3$2e$1_react$40$19$2e$3$2e$1_$5f$react$40$19$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useNow.useEffect": ()=>{
            const timer = window.setInterval({
                "useNow.useEffect.timer": ()=>setNow(Date.now())
            }["useNow.useEffect.timer"], intervalMs);
            return ({
                "useNow.useEffect": ()=>window.clearInterval(timer)
            })["useNow.useEffect"];
        }
    }["useNow.useEffect"], [
        intervalMs
    ]);
    return now;
}
_s(useNow, "2IU6yg86GfAIPaiHfn+vZjj7R4s=");
const KINDS = [
    "all",
    "scratch",
    "note",
    "decision",
    "milestone"
];
function ViewerSection() {
    _s1();
    const [mode, setMode] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$26$2e$6$2e$5_react$2d$dom$40$19$2e$3$2e$1_react$40$19$2e$3$2e$1_$5f$react$40$19$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("demo");
    const [repoInput, setRepoInput] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$26$2e$6$2e$5_react$2d$dom$40$19$2e$3$2e$1_react$40$19$2e$3$2e$1_$5f$react$40$19$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$lib$2f$demo$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEMO_REPO_ID"]);
    const [keyInput, setKeyInput] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$26$2e$6$2e$5_react$2d$dom$40$19$2e$3$2e$1_react$40$19$2e$3$2e$1_$5f$react$40$19$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        "ViewerSection.useState": ()=>demoInvite()
    }["ViewerSection.useState"]);
    const [data, setData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$26$2e$6$2e$5_react$2d$dom$40$19$2e$3$2e$1_react$40$19$2e$3$2e$1_$5f$react$40$19$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [busy, setBusy] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$26$2e$6$2e$5_react$2d$dom$40$19$2e$3$2e$1_react$40$19$2e$3$2e$1_$5f$react$40$19$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$26$2e$6$2e$5_react$2d$dom$40$19$2e$3$2e$1_react$40$19$2e$3$2e$1_$5f$react$40$19$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [selectedId, setSelectedId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$26$2e$6$2e$5_react$2d$dom$40$19$2e$3$2e$1_react$40$19$2e$3$2e$1_$5f$react$40$19$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [branchFilter, setBranchFilter] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$26$2e$6$2e$5_react$2d$dom$40$19$2e$3$2e$1_react$40$19$2e$3$2e$1_$5f$react$40$19$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("all");
    const [kindFilter, setKindFilter] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$26$2e$6$2e$5_react$2d$dom$40$19$2e$3$2e$1_react$40$19$2e$3$2e$1_$5f$react$40$19$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("all");
    const [query, setQuery] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$26$2e$6$2e$5_react$2d$dom$40$19$2e$3$2e$1_react$40$19$2e$3$2e$1_$5f$react$40$19$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [lastRefreshed, setLastRefreshed] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$26$2e$6$2e$5_react$2d$dom$40$19$2e$3$2e$1_react$40$19$2e$3$2e$1_$5f$react$40$19$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        "ViewerSection.useState": ()=>Date.now()
    }["ViewerSection.useState"]);
    const [enterIds, setEnterIds] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$26$2e$6$2e$5_react$2d$dom$40$19$2e$3$2e$1_react$40$19$2e$3$2e$1_$5f$react$40$19$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(new Set());
    const anchorRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$26$2e$6$2e$5_react$2d$dom$40$19$2e$3$2e$1_react$40$19$2e$3$2e$1_$5f$react$40$19$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(Math.floor(Date.now() / 1000));
    const knownIdsRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$26$2e$6$2e$5_react$2d$dom$40$19$2e$3$2e$1_react$40$19$2e$3$2e$1_$5f$react$40$19$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(new Set());
    const busyRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$26$2e$6$2e$5_react$2d$dom$40$19$2e$3$2e$1_react$40$19$2e$3$2e$1_$5f$react$40$19$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(false);
    const modeRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$26$2e$6$2e$5_react$2d$dom$40$19$2e$3$2e$1_react$40$19$2e$3$2e$1_$5f$react$40$19$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(mode);
    modeRef.current = mode;
    const now = useNow(1000);
    const load = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$26$2e$6$2e$5_react$2d$dom$40$19$2e$3$2e$1_react$40$19$2e$3$2e$1_$5f$react$40$19$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "ViewerSection.useCallback[load]": async (silent)=>{
            if (busyRef.current) {
                return;
            }
            busyRef.current = true;
            if (!silent) {
                setBusy(true);
                setError(null);
            }
            try {
                const currentMode = modeRef.current;
                let next;
                if (currentMode === "demo") {
                    const invite = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$lib$2f$crypto$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["parseInvite"])(keyInput);
                    const key = invite !== null ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$lib$2f$crypto$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["parseGroupKey"])(invite.groupKeyBase64) : (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$lib$2f$crypto$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["parseGroupKey"])(keyInput);
                    next = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$lib$2f$demo$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["buildDemoData"])(anchorRef.current);
                    if (key === null) {
                        next = {
                            ...next,
                            commits: next.commits.map({
                                "ViewerSection.useCallback[load]": (commit)=>({
                                        ...commit,
                                        body: null,
                                        locked: commit.status === "verified"
                                    })
                            }["ViewerSection.useCallback[load]"])
                        };
                    }
                } else {
                    const invite = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$lib$2f$crypto$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["parseInvite"])(keyInput);
                    const repoId = (invite !== null ? invite.repoId : repoInput).trim();
                    const key = invite !== null ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$lib$2f$crypto$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["parseGroupKey"])(invite.groupKeyBase64) : (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$lib$2f$crypto$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["parseGroupKey"])(keyInput);
                    if (invite !== null && invite.repoId !== repoInput) {
                        setRepoInput(invite.repoId);
                    }
                    if (repoId === "") {
                        throw new Error("enter a repo id or paste a cogit1: invite");
                    }
                    next = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$lib$2f$live$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchLiveData"])(repoId, key);
                    if (("TURBOPACK compile-time value", "object") !== "undefined" && window.location.search !== `?repo=${repoId}`) {
                        window.history.replaceState(null, "", `?repo=${encodeURIComponent(repoId)}#viewer`);
                    }
                }
                const fresh = new Set();
                for (const commit of next.commits){
                    if (!knownIdsRef.current.has(commit.id)) {
                        fresh.add(commit.id);
                    }
                }
                knownIdsRef.current = new Set(next.commits.map({
                    "ViewerSection.useCallback[load]": (c)=>c.id
                }["ViewerSection.useCallback[load]"]));
                setEnterIds(fresh);
                setData(next);
                setLastRefreshed(Date.now());
                setSelectedId({
                    "ViewerSection.useCallback[load]": (current)=>{
                        if (current !== null && next.commits.some({
                            "ViewerSection.useCallback[load]": (c)=>c.id === current
                        }["ViewerSection.useCallback[load]"])) {
                            return current;
                        }
                        return next.commits[0]?.id ?? null;
                    }
                }["ViewerSection.useCallback[load]"]);
            } catch (err) {
                if (!silent) {
                    if (err instanceof __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$lib$2f$live$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["RepoNotFoundError"]) {
                        setError("No repo entity with that id on tiramisu. Check the id, or paste a cogit1: invite from cogit invite.");
                    } else {
                        setError(err instanceof Error ? err.message : "could not read from Arkiv");
                    }
                }
            } finally{
                busyRef.current = false;
                if (!silent) {
                    setBusy(false);
                }
            }
        }
    }["ViewerSection.useCallback[load]"], [
        keyInput,
        repoInput
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$26$2e$6$2e$5_react$2d$dom$40$19$2e$3$2e$1_react$40$19$2e$3$2e$1_$5f$react$40$19$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ViewerSection.useEffect": ()=>{
            void load(false);
        }
    }["ViewerSection.useEffect"], [
        load
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$26$2e$6$2e$5_react$2d$dom$40$19$2e$3$2e$1_react$40$19$2e$3$2e$1_$5f$react$40$19$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ViewerSection.useEffect": ()=>{
            const timer = window.setInterval({
                "ViewerSection.useEffect.timer": ()=>{
                    void load(true);
                }
            }["ViewerSection.useEffect.timer"], 5000);
            return ({
                "ViewerSection.useEffect": ()=>window.clearInterval(timer)
            })["ViewerSection.useEffect"];
        }
    }["ViewerSection.useEffect"], [
        load
    ]);
    const invite = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$26$2e$6$2e$5_react$2d$dom$40$19$2e$3$2e$1_react$40$19$2e$3$2e$1_$5f$react$40$19$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "ViewerSection.useMemo[invite]": ()=>{
            const parsed = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$lib$2f$crypto$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["parseInvite"])(keyInput);
            return parsed !== null ? parsed.repoId : null;
        }
    }["ViewerSection.useMemo[invite]"], [
        keyInput
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$26$2e$6$2e$5_react$2d$dom$40$19$2e$3$2e$1_react$40$19$2e$3$2e$1_$5f$react$40$19$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ViewerSection.useEffect": ()=>{
            if (invite !== null && invite !== repoInput) {
                setRepoInput(invite);
            }
        }
    }["ViewerSection.useEffect"], [
        invite,
        repoInput
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$26$2e$6$2e$5_react$2d$dom$40$19$2e$3$2e$1_react$40$19$2e$3$2e$1_$5f$react$40$19$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ViewerSection.useEffect": ()=>{
            if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
            ;
            const repo = new URLSearchParams(window.location.search).get("repo");
            if (repo !== null && repo !== "") {
                setRepoInput(repo);
            }
        }
    }["ViewerSection.useEffect"], []);
    const branchOrder = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$26$2e$6$2e$5_react$2d$dom$40$19$2e$3$2e$1_react$40$19$2e$3$2e$1_$5f$react$40$19$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "ViewerSection.useMemo[branchOrder]": ()=>{
            if (data === null) {
                return [];
            }
            const fromEntities = [
                ...data.branches
            ].sort({
                "ViewerSection.useMemo[branchOrder].fromEntities": (a, b)=>a.createdAtBlock - b.createdAtBlock
            }["ViewerSection.useMemo[branchOrder].fromEntities"]);
            const entityOrder = fromEntities.map({
                "ViewerSection.useMemo[branchOrder].entityOrder": (b)=>b.name
            }["ViewerSection.useMemo[branchOrder].entityOrder"]);
            const commitOrder = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$lib$2f$graph$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["orderBranches"])(data.commits);
            const seen = new Set();
            const merged = [];
            for (const name of entityOrder){
                if (!seen.has(name)) {
                    seen.add(name);
                    merged.push(name);
                }
            }
            for (const name of commitOrder){
                if (!seen.has(name)) {
                    seen.add(name);
                    merged.push(name);
                }
            }
            return merged;
        }
    }["ViewerSection.useMemo[branchOrder]"], [
        data
    ]);
    const colors = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$26$2e$6$2e$5_react$2d$dom$40$19$2e$3$2e$1_react$40$19$2e$3$2e$1_$5f$react$40$19$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "ViewerSection.useMemo[colors]": ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$lib$2f$graph$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["branchColorMap"])(branchOrder)
    }["ViewerSection.useMemo[colors]"], [
        branchOrder
    ]);
    const counts = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$26$2e$6$2e$5_react$2d$dom$40$19$2e$3$2e$1_react$40$19$2e$3$2e$1_$5f$react$40$19$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "ViewerSection.useMemo[counts]": ()=>{
            const map = new Map();
            if (data !== null) {
                for (const commit of data.commits){
                    const branch = commit.envelope.branch;
                    map.set(branch, (map.get(branch) ?? 0) + 1);
                }
            }
            return map;
        }
    }["ViewerSection.useMemo[counts]"], [
        data
    ]);
    const matches = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$26$2e$6$2e$5_react$2d$dom$40$19$2e$3$2e$1_react$40$19$2e$3$2e$1_$5f$react$40$19$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "ViewerSection.useCallback[matches]": (commit)=>{
            if (branchFilter !== "all" && commit.envelope.branch !== branchFilter) {
                return false;
            }
            if (kindFilter !== "all" && commit.envelope.kind !== kindFilter) {
                return false;
            }
            if (query.trim() !== "") {
                const q = query.trim().toLowerCase();
                const hay = `${commit.body?.summary ?? ""} ${commit.body?.details ?? ""} ${commit.envelope.commitHash} ${commit.envelope.branch} ${commit.envelope.agent}`.toLowerCase();
                if (!hay.includes(q)) {
                    return false;
                }
            }
            return true;
        }
    }["ViewerSection.useCallback[matches]"], [
        branchFilter,
        kindFilter,
        query
    ]);
    const filtered = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$26$2e$6$2e$5_react$2d$dom$40$19$2e$3$2e$1_react$40$19$2e$3$2e$1_$5f$react$40$19$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "ViewerSection.useMemo[filtered]": ()=>{
            if (data === null) {
                return [];
            }
            return data.commits.filter(matches);
        }
    }["ViewerSection.useMemo[filtered]"], [
        data,
        matches
    ]);
    const dimCommits = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$26$2e$6$2e$5_react$2d$dom$40$19$2e$3$2e$1_react$40$19$2e$3$2e$1_$5f$react$40$19$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "ViewerSection.useMemo[dimCommits]": ()=>{
            const set = new Set();
            if (data !== null) {
                for (const commit of data.commits){
                    if (!matches(commit)) {
                        set.add(commit.id);
                    }
                }
            }
            return set;
        }
    }["ViewerSection.useMemo[dimCommits]"], [
        data,
        matches
    ]);
    const dimBranches = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$26$2e$6$2e$5_react$2d$dom$40$19$2e$3$2e$1_react$40$19$2e$3$2e$1_$5f$react$40$19$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "ViewerSection.useMemo[dimBranches]": ()=>{
            const active = new Set(filtered.map({
                "ViewerSection.useMemo[dimBranches]": (c)=>c.envelope.branch
            }["ViewerSection.useMemo[dimBranches]"]));
            const dim = new Set();
            for (const branch of branchOrder){
                if (!active.has(branch)) {
                    dim.add(branch);
                }
            }
            return dim;
        }
    }["ViewerSection.useMemo[dimBranches]"], [
        filtered,
        branchOrder
    ]);
    const graph = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$26$2e$6$2e$5_react$2d$dom$40$19$2e$3$2e$1_react$40$19$2e$3$2e$1_$5f$react$40$19$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "ViewerSection.useMemo[graph]": ()=>{
            if (data === null) {
                return null;
            }
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$lib$2f$graph$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["buildGraph"])(data.commits, branchOrder, Math.floor(now / 1000));
        }
    }["ViewerSection.useMemo[graph]"], [
        data,
        branchOrder,
        now
    ]);
    const selected = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$26$2e$6$2e$5_react$2d$dom$40$19$2e$3$2e$1_react$40$19$2e$3$2e$1_$5f$react$40$19$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "ViewerSection.useMemo[selected]": ()=>{
            if (data === null || selectedId === null) {
                return null;
            }
            return data.commits.find({
                "ViewerSection.useMemo[selected]": (c)=>c.id === selectedId
            }["ViewerSection.useMemo[selected]"]) ?? null;
        }
    }["ViewerSection.useMemo[selected]"], [
        data,
        selectedId
    ]);
    const repo = data?.repo ?? null;
    const timing = data?.blockTiming ?? null;
    const members = repo?.members ?? [];
    const refreshedAgo = Math.max(0, Math.floor((now - lastRefreshed) / 1000));
    const createdLabel = repo === null || timing === null ? "—" : (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$lib$2f$format$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["absDate"])(timing.currentBlockTime - (timing.currentBlock - repo.createdAtBlock) * timing.blockDuration);
    const status = mode === "demo" ? "reading a seeded demo repo · auto-refresh 5 s" : `reading tiramisu rpc from your browser · auto-refresh 5 s`;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$26$2e$6$2e$5_react$2d$dom$40$19$2e$3$2e$1_react$40$19$2e$3$2e$1_$5f$react$40$19$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        className: "section viewer",
        id: "viewer",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$26$2e$6$2e$5_react$2d$dom$40$19$2e$3$2e$1_react$40$19$2e$3$2e$1_$5f$react$40$19$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "wrap",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$26$2e$6$2e$5_react$2d$dom$40$19$2e$3$2e$1_react$40$19$2e$3$2e$1_$5f$react$40$19$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "section-head",
                    "data-reveal": true,
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$26$2e$6$2e$5_react$2d$dom$40$19$2e$3$2e$1_react$40$19$2e$3$2e$1_$5f$react$40$19$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$26$2e$6$2e$5_react$2d$dom$40$19$2e$3$2e$1_react$40$19$2e$3$2e$1_$5f$react$40$19$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "eyebrow",
                                    children: "01 — Viewer"
                                }, void 0, false, {
                                    fileName: "[project]/frontend/components/viewer/ViewerSection.tsx",
                                    lineNumber: 282,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$26$2e$6$2e$5_react$2d$dom$40$19$2e$3$2e$1_react$40$19$2e$3$2e$1_$5f$react$40$19$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                    className: "h2",
                                    children: "Branches, not Slack threads."
                                }, void 0, false, {
                                    fileName: "[project]/frontend/components/viewer/ViewerSection.tsx",
                                    lineNumber: 283,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/frontend/components/viewer/ViewerSection.tsx",
                            lineNumber: 281,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$26$2e$6$2e$5_react$2d$dom$40$19$2e$3$2e$1_react$40$19$2e$3$2e$1_$5f$react$40$19$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "section-note",
                            children: "Reads Arkiv directly from this page, decrypts commit bodies in the browser, and re-checks every signature. The group key stays in memory for the tab's lifetime — it is never sent anywhere."
                        }, void 0, false, {
                            fileName: "[project]/frontend/components/viewer/ViewerSection.tsx",
                            lineNumber: 285,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/frontend/components/viewer/ViewerSection.tsx",
                    lineNumber: 280,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$26$2e$6$2e$5_react$2d$dom$40$19$2e$3$2e$1_react$40$19$2e$3$2e$1_$5f$react$40$19$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$components$2f$viewer$2f$ConnectBar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                    mode: mode,
                    onMode: (nextMode)=>{
                        setMode(nextMode);
                        setError(null);
                        if (nextMode === "demo") {
                            setRepoInput(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$lib$2f$demo$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEMO_REPO_ID"]);
                            setKeyInput(demoInvite());
                        }
                    },
                    repoInput: repoInput,
                    setRepoInput: setRepoInput,
                    keyInput: keyInput,
                    setKeyInput: setKeyInput,
                    onConnect: ()=>{
                        void load(false);
                    },
                    busy: busy,
                    status: status,
                    error: error
                }, void 0, false, {
                    fileName: "[project]/frontend/components/viewer/ViewerSection.tsx",
                    lineNumber: 292,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$26$2e$6$2e$5_react$2d$dom$40$19$2e$3$2e$1_react$40$19$2e$3$2e$1_$5f$react$40$19$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "workbench card",
                    "data-reveal": true,
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$26$2e$6$2e$5_react$2d$dom$40$19$2e$3$2e$1_react$40$19$2e$3$2e$1_$5f$react$40$19$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "wb-bar",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$26$2e$6$2e$5_react$2d$dom$40$19$2e$3$2e$1_react$40$19$2e$3$2e$1_$5f$react$40$19$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "wb-crumbs",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$26$2e$6$2e$5_react$2d$dom$40$19$2e$3$2e$1_react$40$19$2e$3$2e$1_$5f$react$40$19$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$components$2f$Icon$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                            name: "i-branch"
                                        }, void 0, false, {
                                            fileName: "[project]/frontend/components/viewer/ViewerSection.tsx",
                                            lineNumber: 317,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$26$2e$6$2e$5_react$2d$dom$40$19$2e$3$2e$1_react$40$19$2e$3$2e$1_$5f$react$40$19$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "wb-name",
                                            children: repo?.name ?? "—"
                                        }, void 0, false, {
                                            fileName: "[project]/frontend/components/viewer/ViewerSection.tsx",
                                            lineNumber: 318,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$26$2e$6$2e$5_react$2d$dom$40$19$2e$3$2e$1_react$40$19$2e$3$2e$1_$5f$react$40$19$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "wb-sep",
                                            children: "/"
                                        }, void 0, false, {
                                            fileName: "[project]/frontend/components/viewer/ViewerSection.tsx",
                                            lineNumber: 319,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$26$2e$6$2e$5_react$2d$dom$40$19$2e$3$2e$1_react$40$19$2e$3$2e$1_$5f$react$40$19$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "wb-path mono",
                                            children: "history"
                                        }, void 0, false, {
                                            fileName: "[project]/frontend/components/viewer/ViewerSection.tsx",
                                            lineNumber: 320,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$26$2e$6$2e$5_react$2d$dom$40$19$2e$3$2e$1_react$40$19$2e$3$2e$1_$5f$react$40$19$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$components$2f$CopyButton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                            text: repo?.id ?? repoInput,
                                            label: "Copy repo id"
                                        }, void 0, false, {
                                            fileName: "[project]/frontend/components/viewer/ViewerSection.tsx",
                                            lineNumber: 321,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$26$2e$6$2e$5_react$2d$dom$40$19$2e$3$2e$1_react$40$19$2e$3$2e$1_$5f$react$40$19$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "mono wb-id",
                                            children: repo?.id ?? repoInput
                                        }, void 0, false, {
                                            fileName: "[project]/frontend/components/viewer/ViewerSection.tsx",
                                            lineNumber: 322,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/frontend/components/viewer/ViewerSection.tsx",
                                    lineNumber: 316,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$26$2e$6$2e$5_react$2d$dom$40$19$2e$3$2e$1_react$40$19$2e$3$2e$1_$5f$react$40$19$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "wb-meta",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$26$2e$6$2e$5_react$2d$dom$40$19$2e$3$2e$1_react$40$19$2e$3$2e$1_$5f$react$40$19$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "avatar-stack",
                                            "aria-label": `${members.length} members`,
                                            children: members.slice(0, 5).map((address, index)=>{
                                                const label = data?.labels[address.toLowerCase()];
                                                const initials = label !== undefined ? label.slice(0, 2).toUpperCase() : address.slice(2, 4).toUpperCase();
                                                const cls = [
                                                    "av-anu",
                                                    "av-ada",
                                                    "av-rit",
                                                    "av-smi",
                                                    "av-kus"
                                                ][index % 5];
                                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$26$2e$6$2e$5_react$2d$dom$40$19$2e$3$2e$1_react$40$19$2e$3$2e$1_$5f$react$40$19$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: `avatar ${cls}`,
                                                    title: label ?? address,
                                                    children: initials
                                                }, address, false, {
                                                    fileName: "[project]/frontend/components/viewer/ViewerSection.tsx",
                                                    lineNumber: 334,
                                                    columnNumber: 21
                                                }, this);
                                            })
                                        }, void 0, false, {
                                            fileName: "[project]/frontend/components/viewer/ViewerSection.tsx",
                                            lineNumber: 325,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$26$2e$6$2e$5_react$2d$dom$40$19$2e$3$2e$1_react$40$19$2e$3$2e$1_$5f$react$40$19$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "wb-meta-txt",
                                            children: [
                                                members.length,
                                                " members"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/frontend/components/viewer/ViewerSection.tsx",
                                            lineNumber: 340,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$26$2e$6$2e$5_react$2d$dom$40$19$2e$3$2e$1_react$40$19$2e$3$2e$1_$5f$react$40$19$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "wb-dot"
                                        }, void 0, false, {
                                            fileName: "[project]/frontend/components/viewer/ViewerSection.tsx",
                                            lineNumber: 341,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$26$2e$6$2e$5_react$2d$dom$40$19$2e$3$2e$1_react$40$19$2e$3$2e$1_$5f$react$40$19$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "wb-meta-txt",
                                            children: [
                                                "block ",
                                                timing === null ? "—" : timing.currentBlock.toLocaleString("en-US").replace(/,/g, " ")
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/frontend/components/viewer/ViewerSection.tsx",
                                            lineNumber: 342,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$26$2e$6$2e$5_react$2d$dom$40$19$2e$3$2e$1_react$40$19$2e$3$2e$1_$5f$react$40$19$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "wb-dot"
                                        }, void 0, false, {
                                            fileName: "[project]/frontend/components/viewer/ViewerSection.tsx",
                                            lineNumber: 345,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$26$2e$6$2e$5_react$2d$dom$40$19$2e$3$2e$1_react$40$19$2e$3$2e$1_$5f$react$40$19$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "wb-meta-txt",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$26$2e$6$2e$5_react$2d$dom$40$19$2e$3$2e$1_react$40$19$2e$3$2e$1_$5f$react$40$19$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$components$2f$Icon$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                    name: "i-refresh",
                                                    className: "ic ic-inline"
                                                }, void 0, false, {
                                                    fileName: "[project]/frontend/components/viewer/ViewerSection.tsx",
                                                    lineNumber: 347,
                                                    columnNumber: 17
                                                }, this),
                                                "refreshed ",
                                                refreshedAgo <= 1 ? "just now" : `${refreshedAgo} s ago`
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/frontend/components/viewer/ViewerSection.tsx",
                                            lineNumber: 346,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/frontend/components/viewer/ViewerSection.tsx",
                                    lineNumber: 324,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/frontend/components/viewer/ViewerSection.tsx",
                            lineNumber: 315,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$26$2e$6$2e$5_react$2d$dom$40$19$2e$3$2e$1_react$40$19$2e$3$2e$1_$5f$react$40$19$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "wb-grid",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$26$2e$6$2e$5_react$2d$dom$40$19$2e$3$2e$1_react$40$19$2e$3$2e$1_$5f$react$40$19$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$components$2f$viewer$2f$BranchRail$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                    branches: data?.branches ?? [],
                                    colors: colors,
                                    counts: counts,
                                    total: data?.commits.length ?? 0,
                                    filter: branchFilter,
                                    onFilter: setBranchFilter,
                                    repo: repo,
                                    labels: data?.labels ?? {},
                                    currentBlock: timing?.currentBlock ?? 0,
                                    blockDuration: timing?.blockDuration ?? 2,
                                    createdLabel: createdLabel
                                }, void 0, false, {
                                    fileName: "[project]/frontend/components/viewer/ViewerSection.tsx",
                                    lineNumber: 354,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$26$2e$6$2e$5_react$2d$dom$40$19$2e$3$2e$1_react$40$19$2e$3$2e$1_$5f$react$40$19$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "center",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$26$2e$6$2e$5_react$2d$dom$40$19$2e$3$2e$1_react$40$19$2e$3$2e$1_$5f$react$40$19$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "center-toolbar",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$26$2e$6$2e$5_react$2d$dom$40$19$2e$3$2e$1_react$40$19$2e$3$2e$1_$5f$react$40$19$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "filters",
                                                    role: "group",
                                                    "aria-label": "Filter by kind",
                                                    children: KINDS.map((kind)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$26$2e$6$2e$5_react$2d$dom$40$19$2e$3$2e$1_react$40$19$2e$3$2e$1_$5f$react$40$19$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            className: `chip${kindFilter === kind ? " is-on" : ""}`,
                                                            type: "button",
                                                            onClick: ()=>setKindFilter(kind),
                                                            children: kind === "all" ? "All" : kind
                                                        }, kind, false, {
                                                            fileName: "[project]/frontend/components/viewer/ViewerSection.tsx",
                                                            lineNumber: 372,
                                                            columnNumber: 21
                                                        }, this))
                                                }, void 0, false, {
                                                    fileName: "[project]/frontend/components/viewer/ViewerSection.tsx",
                                                    lineNumber: 370,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$26$2e$6$2e$5_react$2d$dom$40$19$2e$3$2e$1_react$40$19$2e$3$2e$1_$5f$react$40$19$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    className: "search",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$26$2e$6$2e$5_react$2d$dom$40$19$2e$3$2e$1_react$40$19$2e$3$2e$1_$5f$react$40$19$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$components$2f$Icon$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                            name: "i-search"
                                                        }, void 0, false, {
                                                            fileName: "[project]/frontend/components/viewer/ViewerSection.tsx",
                                                            lineNumber: 383,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$26$2e$6$2e$5_react$2d$dom$40$19$2e$3$2e$1_react$40$19$2e$3$2e$1_$5f$react$40$19$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                            type: "text",
                                                            placeholder: "Filter commits",
                                                            spellCheck: false,
                                                            value: query,
                                                            onChange: (event)=>setQuery(event.target.value)
                                                        }, void 0, false, {
                                                            fileName: "[project]/frontend/components/viewer/ViewerSection.tsx",
                                                            lineNumber: 384,
                                                            columnNumber: 19
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/frontend/components/viewer/ViewerSection.tsx",
                                                    lineNumber: 382,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/frontend/components/viewer/ViewerSection.tsx",
                                            lineNumber: 369,
                                            columnNumber: 15
                                        }, this),
                                        graph !== null ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$26$2e$6$2e$5_react$2d$dom$40$19$2e$3$2e$1_react$40$19$2e$3$2e$1_$5f$react$40$19$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$components$2f$viewer$2f$CommitGraph$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                            graph: graph,
                                            commits: data?.commits ?? [],
                                            selectedId: selectedId,
                                            dimCommits: dimCommits,
                                            dimBranches: dimBranches,
                                            nowSeconds: Math.floor(now / 1000),
                                            onSelect: setSelectedId
                                        }, void 0, false, {
                                            fileName: "[project]/frontend/components/viewer/ViewerSection.tsx",
                                            lineNumber: 395,
                                            columnNumber: 17
                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$26$2e$6$2e$5_react$2d$dom$40$19$2e$3$2e$1_react$40$19$2e$3$2e$1_$5f$react$40$19$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "graph"
                                        }, void 0, false, {
                                            fileName: "[project]/frontend/components/viewer/ViewerSection.tsx",
                                            lineNumber: 405,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$26$2e$6$2e$5_react$2d$dom$40$19$2e$3$2e$1_react$40$19$2e$3$2e$1_$5f$react$40$19$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$components$2f$viewer$2f$CommitList$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                            commits: filtered,
                                            total: data?.commits.length ?? 0,
                                            selectedId: selectedId,
                                            onSelect: setSelectedId,
                                            colors: colors,
                                            labels: data?.labels ?? {},
                                            nowSeconds: Math.floor(now / 1000),
                                            enterIds: enterIds
                                        }, void 0, false, {
                                            fileName: "[project]/frontend/components/viewer/ViewerSection.tsx",
                                            lineNumber: 408,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/frontend/components/viewer/ViewerSection.tsx",
                                    lineNumber: 368,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$26$2e$6$2e$5_react$2d$dom$40$19$2e$3$2e$1_react$40$19$2e$3$2e$1_$5f$react$40$19$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$components$2f$viewer$2f$DetailPanel$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                    commit: selected,
                                    repo: repo,
                                    labels: data?.labels ?? {},
                                    timing: timing
                                }, void 0, false, {
                                    fileName: "[project]/frontend/components/viewer/ViewerSection.tsx",
                                    lineNumber: 420,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/frontend/components/viewer/ViewerSection.tsx",
                            lineNumber: 353,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/frontend/components/viewer/ViewerSection.tsx",
                    lineNumber: 314,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$2_$40$types$2b$node$40$26$2e$6$2e$5_react$2d$dom$40$19$2e$3$2e$1_react$40$19$2e$3$2e$1_$5f$react$40$19$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "viewer-foot mono",
                    "data-reveal": true,
                    children: "new commit appears ≤ 5 s after the write · invalid entries render red with the reason and are never decrypted"
                }, void 0, false, {
                    fileName: "[project]/frontend/components/viewer/ViewerSection.tsx",
                    lineNumber: 424,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/frontend/components/viewer/ViewerSection.tsx",
            lineNumber: 279,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/frontend/components/viewer/ViewerSection.tsx",
        lineNumber: 278,
        columnNumber: 5
    }, this);
}
_s1(ViewerSection, "+ZtjTdFHHP3Bew0QjFRb1Kh2POA=", false, function() {
    return [
        useNow
    ];
});
_c = ViewerSection;
var _c;
__turbopack_context__.k.register(_c, "ViewerSection");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/frontend/lib/crypto.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "addressForPrivateKey",
    ()=>addressForPrivateKey,
    "base64ToBytes",
    ()=>base64ToBytes,
    "bytesToBase64",
    ()=>bytesToBase64,
    "bytesToHex",
    ()=>bytesToHex,
    "bytesToUtf8",
    ()=>bytesToUtf8,
    "canonicalJson",
    ()=>canonicalJson,
    "ciphertextHash",
    ()=>ciphertextHash,
    "computeCommitHash",
    ()=>computeCommitHash,
    "decryptBody",
    ()=>decryptBody,
    "encryptBody",
    ()=>encryptBody,
    "newNonce",
    ()=>newNonce,
    "parseGroupKey",
    ()=>parseGroupKey,
    "parseInvite",
    ()=>parseInvite,
    "randomGroupKey",
    ()=>randomGroupKey,
    "recoverAuthor",
    ()=>recoverAuthor,
    "sha256Hex",
    ()=>sha256Hex,
    "signCommitHash",
    ()=>signCommitHash,
    "utf8ToBytes",
    ()=>utf8ToBytes
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$noble$2b$ciphers$40$2$2e$4$2e$0$2f$node_modules$2f40$noble$2f$ciphers$2f$chacha$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@noble+ciphers@2.4.0/node_modules/@noble/ciphers/chacha.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$noble$2b$hashes$40$2$2e$4$2e$0$2f$node_modules$2f40$noble$2f$hashes$2f$sha2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@noble+hashes@2.4.0/node_modules/@noble/hashes/sha2.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$viem$40$2$2e$57$2e$7_typescript$40$7$2e$0$2e$2_zod$40$4$2e$6$2e$7$2f$node_modules$2f$viem$2f$_esm$2f$utils$2f$signature$2f$recoverMessageAddress$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/viem@2.57.7_typescript@7.0.2_zod@4.6.7/node_modules/viem/_esm/utils/signature/recoverMessageAddress.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$viem$40$2$2e$57$2e$7_typescript$40$7$2e$0$2e$2_zod$40$4$2e$6$2e$7$2f$node_modules$2f$viem$2f$_esm$2f$accounts$2f$privateKeyToAccount$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/viem@2.57.7_typescript@7.0.2_zod@4.6.7/node_modules/viem/_esm/accounts/privateKeyToAccount.js [app-client] (ecmascript)");
;
;
;
;
const textEncoder = new TextEncoder();
const textDecoder = new TextDecoder();
function bytesToBase64(bytes) {
    let binary = "";
    const chunk = 0x8000;
    for(let i = 0; i < bytes.length; i += chunk){
        binary += String.fromCharCode.apply(null, Array.from(bytes.subarray(i, i + chunk)));
    }
    return btoa(binary);
}
function base64ToBytes(text) {
    const normalized = text.trim().replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalized + "=".repeat((4 - normalized.length % 4) % 4);
    const binary = atob(padded);
    const bytes = new Uint8Array(binary.length);
    for(let i = 0; i < binary.length; i += 1){
        bytes[i] = binary.charCodeAt(i);
    }
    return bytes;
}
function bytesToHex(bytes) {
    let hex = "";
    for (const byte of bytes){
        hex += byte.toString(16).padStart(2, "0");
    }
    return hex;
}
function sha256Hex(data) {
    const bytes = typeof data === "string" ? textEncoder.encode(data) : data;
    return bytesToHex((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$noble$2b$hashes$40$2$2e$4$2e$0$2f$node_modules$2f40$noble$2f$hashes$2f$sha2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["sha256"])(bytes));
}
function utf8ToBytes(text) {
    return textEncoder.encode(text);
}
function bytesToUtf8(bytes) {
    return textDecoder.decode(bytes);
}
function sortValue(value) {
    if (Array.isArray(value)) {
        return value.map(sortValue);
    }
    if (value !== null && typeof value === "object") {
        const out = {};
        for (const key of Object.keys(value).sort()){
            out[key] = sortValue(value[key]);
        }
        return out;
    }
    return value;
}
function canonicalJson(value) {
    return JSON.stringify(sortValue(value));
}
function computeCommitHash(fields) {
    return `0x${sha256Hex(canonicalJson(fields))}`;
}
function ciphertextHash(ciphertextBase64) {
    return sha256Hex(base64ToBytes(ciphertextBase64));
}
function newNonce() {
    return crypto.getRandomValues(new Uint8Array(24));
}
function randomGroupKey() {
    return crypto.getRandomValues(new Uint8Array(32));
}
function encryptBody(body, groupKey) {
    const nonce = newNonce();
    const sealed = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$noble$2b$ciphers$40$2$2e$4$2e$0$2f$node_modules$2f40$noble$2f$ciphers$2f$chacha$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["xchacha20poly1305"])(groupKey, nonce).encrypt(textEncoder.encode(JSON.stringify(body)));
    return {
        nonce: bytesToBase64(nonce),
        ciphertext: bytesToBase64(sealed)
    };
}
function decryptBody(nonceBase64, ciphertextBase64, groupKey) {
    const opened = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$noble$2b$ciphers$40$2$2e$4$2e$0$2f$node_modules$2f40$noble$2f$ciphers$2f$chacha$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["xchacha20poly1305"])(groupKey, base64ToBytes(nonceBase64)).decrypt(base64ToBytes(ciphertextBase64));
    const parsed = JSON.parse(bytesToUtf8(opened));
    return {
        summary: typeof parsed.summary === "string" ? parsed.summary : "",
        details: typeof parsed.details === "string" ? parsed.details : "",
        tags: Array.isArray(parsed.tags) ? parsed.tags.filter((t)=>typeof t === "string") : []
    };
}
async function signCommitHash(privateKey, commitHash) {
    const account = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$viem$40$2$2e$57$2e$7_typescript$40$7$2e$0$2e$2_zod$40$4$2e$6$2e$7$2f$node_modules$2f$viem$2f$_esm$2f$accounts$2f$privateKeyToAccount$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["privateKeyToAccount"])(privateKey);
    return account.signMessage({
        message: commitHash
    });
}
async function recoverAuthor(commitHash, sig) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$viem$40$2$2e$57$2e$7_typescript$40$7$2e$0$2e$2_zod$40$4$2e$6$2e$7$2f$node_modules$2f$viem$2f$_esm$2f$utils$2f$signature$2f$recoverMessageAddress$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["recoverMessageAddress"])({
        message: commitHash,
        signature: sig
    });
}
async function addressForPrivateKey(privateKey) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$viem$40$2$2e$57$2e$7_typescript$40$7$2e$0$2e$2_zod$40$4$2e$6$2e$7$2f$node_modules$2f$viem$2f$_esm$2f$accounts$2f$privateKeyToAccount$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["privateKeyToAccount"])(privateKey).address;
}
function parseInvite(text) {
    const parts = text.trim().split(":");
    if (parts.length !== 3 || parts[0] !== "cogit1") {
        return null;
    }
    const repoId = parts[1];
    const key = parts[2];
    if (!repoId || !key) {
        return null;
    }
    try {
        const bytes = base64ToBytes(key);
        if (bytes.length !== 32) {
            return null;
        }
    } catch  {
        return null;
    }
    return {
        repoId,
        groupKeyBase64: key
    };
}
function parseGroupKey(text) {
    const trimmed = text.trim();
    if (trimmed.length === 0) {
        return null;
    }
    try {
        const bytes = base64ToBytes(trimmed);
        if (bytes.length !== 32) {
            return null;
        }
        return bytes;
    } catch  {
        return null;
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/frontend/lib/demo.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DEMO_REPO_ID",
    ()=>DEMO_REPO_ID,
    "DEMO_REPO_NAME",
    ()=>DEMO_REPO_NAME,
    "buildDemoData",
    ()=>buildDemoData,
    "demoGroupKey",
    ()=>demoGroupKey
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$noble$2b$ciphers$40$2$2e$4$2e$0$2f$node_modules$2f40$noble$2f$ciphers$2f$chacha$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@noble+ciphers@2.4.0/node_modules/@noble/ciphers/chacha.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$lib$2f$crypto$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/lib/crypto.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$lib$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/lib/types.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$lib$2f$verify$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/lib/verify.ts [app-client] (ecmascript)");
;
;
;
;
const DEMO_REPO_ID = "a7d3f9c21b84e650";
const DEMO_REPO_NAME = "atlas-reports";
const DEMO_GROUP_KEY_TEXT = "cogit-demo-group-key-32-bytes!!!";
function demoGroupKey() {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$lib$2f$crypto$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["utf8ToBytes"])(DEMO_GROUP_KEY_TEXT);
}
const ACCOUNTS = [
    {
        label: "anurag",
        privateKey: "0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d"
    },
    {
        label: "ritesh",
        privateKey: "0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a"
    },
    {
        label: "adarsh",
        privateKey: "0x7c852118294e51e653712a81e05800f419141751be58f605c371e15141b007a6"
    },
    {
        label: "smriti",
        privateKey: "0x47e179ec197488593b187f80a00eb0da91f1b9d0b13f8733639f19c30a34926a"
    },
    {
        label: "kushal",
        privateKey: "0x8b3a350cf5c34c9194ca85829a2df0ec3153be0318b5e2d3348e872092edffba"
    },
    {
        label: "mallory",
        privateKey: "0x92db14e403b83dfe3df233f83dfa3a0d7096f21ca9b0d6d6b8d88b2b4ec1564e"
    }
];
const FIXTURES = [
    {
        slug: "main-init",
        branch: "main",
        kind: "milestone",
        days: 9.0,
        author: "anurag",
        agent: "human",
        summary: "Repo initialized — atlas reports dashboard",
        details: "Created the repo on Arkiv and forked `main`. Group key generated and shared out-of-band; every teammate joins with `cogit join`.",
        tags: [
            "repo"
        ],
        parent: null
    },
    {
        slug: "main-mono",
        branch: "main",
        kind: "decision",
        days: 8.2,
        author: "anurag",
        agent: "claude-code",
        summary: "Monorepo: pnpm workspaces, TypeScript everywhere",
        details: "One workspace, three packages: `cli`, `core`, `mcp`. Shared protocol logic lives in `core` so the viewer and the CLI verify with the same code.",
        tags: [
            "build",
            "setup"
        ],
        parent: "main-init"
    },
    {
        slug: "adarsh-spike",
        branch: "adarsh",
        kind: "scratch",
        days: 7.8,
        author: "adarsh",
        agent: "cursor",
        summary: "Ingest spike: batching against 2 s blocks",
        details: "Throwaway: timed writes against a local node. Batches of 25 land in one block; below 10 the 2 s cadence dominates. Will re-measure before deciding.",
        tags: [
            "perf"
        ],
        parent: "main-mono"
    },
    {
        slug: "adarsh-worker",
        branch: "adarsh",
        kind: "note",
        days: 7.1,
        author: "adarsh",
        agent: "cursor",
        summary: "Ingest worker: single ws subscription, idempotent writes",
        details: "Chose one websocket subscription over polling; writes are idempotent by `report_id` so replays are safe. Retry budget: 3 attempts, exp backoff 250 ms.",
        tags: [
            "ingest"
        ],
        parent: "adarsh-spike"
    },
    {
        slug: "main-pg",
        branch: "main",
        kind: "decision",
        days: 6.6,
        author: "anurag",
        agent: "claude-code",
        summary: "Postgres + JSONB for the reports table; wallet-signature auth",
        details: [
            "## Decision",
            "",
            "One Postgres table for reports; flexible payloads live in a `jsonb` column. Authentication is wallet-signature based — no passwords, reusing the same keys as Arkiv.",
            "",
            "```sql",
            "create table reports (",
            "  id          bigserial primary key,",
            "  org_id      uuid not null,",
            "  payload     jsonb not null,",
            "  report_date date not null,",
            "  created_by  text not null,      -- wallet address",
            "  created_at  timestamptz not null default now()",
            ");",
            "```",
            "",
            "## Why",
            "",
            "- Report shapes change weekly; one table keeps migrations small.",
            "- `jsonb` with a GIN index measured 120 ms p95 on 2 M rows.",
            "- Wallet signatures reuse the Arkiv identity — one key for chain and app.",
            "",
            "## Auth flow",
            "",
            "1. Server issues a single-use nonce.",
            "2. Client signs `\"atlas-login:<nonce>\"` with its wallet.",
            "3. Server recovers the address and replies with a signed token."
        ].join("\n"),
        tags: [
            "db",
            "auth"
        ],
        parent: "main-mono"
    },
    {
        slug: "ritesh-plan",
        branch: "ritesh",
        kind: "note",
        days: 6.2,
        author: "ritesh",
        agent: "opencode",
        summary: "Read anurag's decision — migration plan",
        details: "Pulled `main` before starting: the JSONB decision is final. Plan: migration `0001_create_reports` with the exact columns, then seed two fake orgs for the staging demo.",
        tags: [
            "migration"
        ],
        parent: "main-pg"
    },
    {
        slug: "ritesh-sql",
        branch: "ritesh",
        kind: "milestone",
        days: 5.4,
        author: "ritesh",
        agent: "opencode",
        summary: "0001_create_reports.sql applied on staging",
        details: "Migration applied cleanly on staging; rollback file generated. Seed data in place — dashboard has something to render end to end.",
        tags: [
            "staging"
        ],
        parent: "ritesh-plan"
    },
    {
        slug: "smriti-charts",
        branch: "smriti",
        kind: "decision",
        days: 5.0,
        author: "smriti",
        agent: "claude-code",
        summary: "Charts: one accent per view, no pies",
        details: "Bar and line charts only; a pie chart gets a bulleted table instead. One accent color per view keeps the dashboard quiet — same rule as the marketing site.",
        tags: [
            "ui"
        ],
        parent: "main-pg"
    },
    {
        slug: "kushal-session",
        branch: "kushal",
        kind: "note",
        days: 4.4,
        author: "kushal",
        agent: "cursor",
        summary: "Session tokens: 24 h TTL, refresh via signed nonce",
        details: "Session token TTL is 24 h; refresh happens through a fresh signed nonce, so a stolen token dies with the session, not with the wallet.",
        tags: [
            "auth"
        ],
        parent: "main-pg"
    },
    {
        slug: "main-sync",
        branch: "main",
        kind: "note",
        days: 3.9,
        author: "anurag",
        agent: "human",
        summary: "Sync: reports v0 to staging Friday",
        details: "Demo freeze Friday 16:00 UTC. After that only bug fixes until the review — keep `main` pullable.",
        tags: [
            "planning"
        ],
        parent: "main-pg"
    },
    {
        slug: "adarsh-idx",
        branch: "adarsh",
        kind: "decision",
        days: 3.2,
        author: "adarsh",
        agent: "cursor",
        summary: "Indexes: GIN on payload, btree on report_date",
        details: "GIN on `payload` (jsonb_path_ops) and a btree on `report_date`. Measured 400 ms → 12 ms on the staging dataset; write overhead is acceptable.",
        tags: [
            "db",
            "perf"
        ],
        parent: "adarsh-worker"
    },
    {
        slug: "smriti-grid",
        branch: "smriti",
        kind: "scratch",
        days: 2.6,
        author: "smriti",
        agent: "claude-code",
        summary: "Responsive grid math for 12-col layout",
        details: "Scratch: gutter = 24 px at ≥ 1024, columns snap 12 → 6 → 2. Breakpoints: 1024 / 720 / 480. Delete once the CSS is in.",
        tags: [
            "ui",
            "scratch"
        ],
        parent: "smriti-charts"
    },
    {
        slug: "kushal-threat",
        branch: "kushal",
        kind: "decision",
        days: 2.0,
        author: "kushal",
        agent: "cursor",
        summary: "Threat model: replay + tamper covered by commit hash",
        details: "Replay is covered by uniqueness of `(author, nonce)` in the envelope; tampering by the commit hash over ciphertext. Remaining accepted risk: group-key holder can read everything — by design.",
        tags: [
            "security"
        ],
        parent: "kushal-session"
    },
    {
        slug: "main-v0",
        branch: "main",
        kind: "milestone",
        days: 1.4,
        author: "anurag",
        agent: "human",
        summary: "v0 tagged — reports + wallet auth on staging",
        details: "Tag `v0` on staging: reports CRUD with wallet auth, ingest worker live. Demo script updated to lead with the auth flow.",
        tags: [
            "release"
        ],
        parent: "main-sync"
    },
    {
        slug: "ritesh-perf",
        branch: "ritesh",
        kind: "note",
        days: 0.6,
        author: "ritesh",
        agent: "opencode",
        summary: "Query perf: 120 ms p95 on 2 M rows (GIN payload)",
        details: "Ran the load test from the plan: p95 120 ms with the GIN index, 1.4 s without. Numbers match anurag's earlier estimate from the decision.",
        tags: [
            "perf"
        ],
        parent: "ritesh-sql"
    },
    {
        slug: "ritesh-forge",
        branch: "ritesh",
        kind: "note",
        days: 0.3,
        author: "ritesh",
        agent: "cursor",
        owner: "mallory",
        summary: "Hotfix: skip signature verification for large pulls",
        details: "should never render — this entity is owned by a wallet that is not the author",
        tags: [
            "hotfix"
        ],
        parent: "ritesh-perf"
    }
];
const BRANCH_OWNER_LABELS = {
    main: "anurag"
};
const ANCHOR_MS = Date.UTC(2026, 9, 17, 6, 0, 0);
const ANCHOR_BLOCK = 701031;
const BLOCK_SECONDS = 2;
function blockFor(nowSeconds, ts) {
    const nowMs = nowSeconds * 1000;
    const currentBlock = ANCHOR_BLOCK + Math.floor((nowMs - ANCHOR_MS) / (BLOCK_SECONDS * 1000));
    return currentBlock - Math.round((nowSeconds - ts) / BLOCK_SECONDS);
}
function pseudoKey(seed) {
    return `0x${(0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$lib$2f$crypto$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["sha256Hex"])(`entity:${seed}`).slice(0, 44)}`;
}
async function buildDemoData(nowSeconds = Math.floor(Date.now() / 1000)) {
    const groupKey = demoGroupKey();
    const addresses = new Map();
    for (const account of ACCOUNTS){
        addresses.set(account.label, await (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$lib$2f$crypto$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["addressForPrivateKey"])(account.privateKey));
    }
    const byLabel = new Map(ACCOUNTS.map((a)=>[
            a.label,
            a
        ]));
    const labels = {};
    for (const [label, address] of addresses){
        labels[address.toLowerCase()] = label;
    }
    const memberAddresses = [
        "anurag",
        "adarsh",
        "ritesh",
        "smriti",
        "kushal"
    ].map((label)=>addresses.get(label));
    const commits = [];
    const hashBySlug = new Map();
    for (const fixture of FIXTURES){
        const account = byLabel.get(fixture.author);
        const author = addresses.get(fixture.author);
        const owner = fixture.owner !== undefined ? addresses.get(fixture.owner) : author;
        const ts = nowSeconds - Math.round(fixture.days * 86400);
        const parent = fixture.parent === null ? null : hashBySlug.get(fixture.parent);
        const body = {
            summary: fixture.summary,
            details: fixture.details,
            tags: fixture.tags
        };
        const nonceRaw = hexToBytes((0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$lib$2f$crypto$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["sha256Hex"])(`demo-nonce:${fixture.slug}`).slice(0, 48));
        const sealed = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$noble$2b$ciphers$40$2$2e$4$2e$0$2f$node_modules$2f40$noble$2f$ciphers$2f$chacha$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["xchacha20poly1305"])(groupKey, nonceRaw).encrypt((0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$lib$2f$crypto$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["utf8ToBytes"])(JSON.stringify(body)));
        const nonceB64 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$lib$2f$crypto$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["bytesToBase64"])(nonceRaw);
        const ciphertext = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$lib$2f$crypto$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["bytesToBase64"])(sealed);
        const hashFields = {
            v: 1,
            repoId: DEMO_REPO_ID,
            branch: fixture.branch,
            parent,
            author,
            kind: fixture.kind,
            ts,
            nonce: nonceB64,
            ciphertextHash: (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$lib$2f$crypto$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ciphertextHash"])(ciphertext)
        };
        const commitHash = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$lib$2f$crypto$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["computeCommitHash"])(hashFields);
        const sig = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$lib$2f$crypto$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["signCommitHash"])(account.privateKey, commitHash);
        const envelope = {
            ...hashFields,
            agent: fixture.agent,
            ciphertext,
            commitHash,
            sig
        };
        hashBySlug.set(fixture.slug, commitHash);
        const verified = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$lib$2f$verify$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["verifyEnvelope"])(envelope, {
            owner,
            members: memberAddresses
        });
        let bodyOut = null;
        if (verified.ok) {
            bodyOut = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$lib$2f$crypto$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["decryptBody"])(envelope.nonce, envelope.ciphertext, groupKey);
        }
        const createdAtBlock = blockFor(nowSeconds, ts);
        commits.push({
            id: commitHash,
            entityKey: pseudoKey(fixture.slug),
            owner,
            envelope,
            body: bodyOut,
            locked: false,
            status: verified.ok ? "verified" : "invalid",
            reason: verified.reason,
            detail: verified.detail,
            checks: verified.checks,
            createdAtBlock,
            expiresAtBlock: createdAtBlock + __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$lib$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["KIND_EXPIRY_DAYS"][fixture.kind] * 86400 / BLOCK_SECONDS
        });
    }
    commits.sort((a, b)=>b.envelope.ts - a.envelope.ts);
    const branchFirst = new Map();
    const branchHead = new Map();
    for (const commit of commits){
        const branch = commit.envelope.branch;
        const first = branchFirst.get(branch);
        if (first === undefined || commit.envelope.ts < first) {
            branchFirst.set(branch, commit.envelope.ts);
        }
        const head = branchHead.get(branch);
        if (head === undefined || commit.envelope.ts > head.envelope.ts) {
            branchHead.set(branch, commit);
        }
    }
    const branches = [
        ...branchFirst.entries()
    ].sort((a, b)=>a[1] - b[1]).map(([name, firstTs])=>{
        const head = branchHead.get(name);
        const firstCommit = [
            ...commits
        ].filter((c)=>c.envelope.branch === name).sort((a, b)=>a.envelope.ts - b.envelope.ts)[0];
        return {
            key: pseudoKey(`branch:${name}`),
            name,
            owner: addresses.get(BRANCH_OWNER_LABELS[name] ?? name),
            head: head.envelope.commitHash,
            forkedFrom: firstCommit.envelope.parent,
            createdAtBlock: blockFor(nowSeconds, firstTs),
            expiresAtBlock: blockFor(nowSeconds, firstTs) + 365 * 86400 / BLOCK_SECONDS
        };
    });
    const repoCreatedBlock = Math.min(...commits.map((c)=>c.createdAtBlock)) - 40;
    const repo = {
        id: DEMO_REPO_ID,
        name: DEMO_REPO_NAME,
        owner: addresses.get("anurag"),
        members: memberAddresses,
        entityKey: pseudoKey(`repo:${DEMO_REPO_ID}`),
        createdAtBlock: repoCreatedBlock,
        expiresAtBlock: repoCreatedBlock + 365 * 86400 / BLOCK_SECONDS
    };
    const blockTiming = {
        currentBlock: ANCHOR_BLOCK + Math.floor((nowSeconds * 1000 - ANCHOR_MS) / (BLOCK_SECONDS * 1000)),
        currentBlockTime: nowSeconds,
        blockDuration: BLOCK_SECONDS
    };
    return {
        source: "demo",
        repo,
        branches,
        commits,
        blockTiming,
        labels
    };
}
function hexToBytes(hex) {
    const clean = hex.startsWith("0x") ? hex.slice(2) : hex;
    const bytes = new Uint8Array(clean.length / 2);
    for(let i = 0; i < bytes.length; i += 1){
        bytes[i] = parseInt(clean.slice(i * 2, i * 2 + 2), 16);
    }
    return bytes;
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/frontend/lib/format.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "BRANCH_COLORS",
    ()=>BRANCH_COLORS,
    "absDate",
    ()=>absDate,
    "absTime",
    ()=>absTime,
    "branchColor",
    ()=>branchColor,
    "checksSummary",
    ()=>checksSummary,
    "countdown",
    ()=>countdown,
    "formatBlock",
    ()=>formatBlock,
    "initialsFor",
    ()=>initialsFor,
    "initialsForLabel",
    ()=>initialsForLabel,
    "kindLabel",
    ()=>kindLabel,
    "reasonLabel",
    ()=>reasonLabel,
    "shortAddress",
    ()=>shortAddress,
    "shortHex",
    ()=>shortHex,
    "timeAgo",
    ()=>timeAgo
]);
const MONTHS = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec"
];
const BRANCH_COLORS = [
    "#57564F",
    "#1F6C9F",
    "#9F2F2D",
    "#346538",
    "#956400",
    "#6B5E8C"
];
function branchColor(index) {
    return BRANCH_COLORS[index % BRANCH_COLORS.length];
}
function shortHex(value, lead = 8, tail = 6) {
    if (value.length <= lead + tail + 2) {
        return value;
    }
    return `${value.slice(0, lead)}…${value.slice(-tail)}`;
}
function shortAddress(value) {
    return shortHex(value, 6, 4);
}
function absTime(tsSeconds) {
    const d = new Date(tsSeconds * 1000);
    const date = `${String(d.getUTCDate()).padStart(2, "0")} ${MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
    const time = `${String(d.getUTCHours()).padStart(2, "0")}:${String(d.getUTCMinutes()).padStart(2, "0")} UTC`;
    return `${date} · ${time}`;
}
function absDate(tsSeconds) {
    const d = new Date(tsSeconds * 1000);
    return `${String(d.getUTCDate()).padStart(2, "0")} ${MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}
function timeAgo(tsSeconds, nowSeconds) {
    const delta = nowSeconds - tsSeconds;
    if (delta < 45) {
        return "just now";
    }
    return `${duration(delta)} ago`;
}
function countdown(secondsRemaining) {
    if (secondsRemaining <= 0) {
        return "expired";
    }
    return `in ${duration(secondsRemaining)}`;
}
function duration(totalSeconds) {
    if (totalSeconds < 90) {
        return `${Math.max(1, Math.round(totalSeconds))} s`;
    }
    const minutes = totalSeconds / 60;
    if (minutes < 90) {
        return `${Math.round(minutes)} m`;
    }
    const hours = minutes / 60;
    if (hours < 36) {
        return `${Math.round(hours)} h`;
    }
    const days = hours / 24;
    if (days < 60) {
        return `${Math.round(days)} d`;
    }
    const months = days / 30;
    if (months < 24) {
        return `${Math.round(months)} mo`;
    }
    return `${Math.round(days / 365)} y`;
}
function formatBlock(block) {
    return Math.round(block).toLocaleString("en-US").replace(/,/g, " ");
}
function initialsFor(label, address) {
    if (label) {
        return label.slice(0, 2).toUpperCase();
    }
    return address.slice(2, 4).toUpperCase();
}
function kindLabel(kind) {
    return kind;
}
const REASON_LABELS = {
    BAD_HASH: "bad hash",
    BAD_SIGNATURE: "bad signature",
    OWNER_MISMATCH: "owner mismatch",
    NOT_MEMBER: "not a member"
};
function reasonLabel(reason) {
    if (reason === undefined) {
        return "unverified";
    }
    return REASON_LABELS[reason];
}
function checkMark(value) {
    if (value === true) {
        return "✓";
    }
    if (value === false) {
        return "×";
    }
    return "–";
}
function checksSummary(checks) {
    return `hash ${checkMark(checks.hash)} · sig ${checkMark(checks.sig)} · owner ${checkMark(checks.owner)} · member ${checkMark(checks.member)}`;
}
function initialsForLabel(label, address) {
    return initialsFor(label, address);
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/frontend/lib/graph.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "branchColorMap",
    ()=>branchColorMap,
    "buildGraph",
    ()=>buildGraph,
    "orderBranches",
    ()=>orderBranches
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$lib$2f$format$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/lib/format.ts [app-client] (ecmascript)");
;
const ROW_H = 44;
const TOP = 40;
const LANE_X0 = 80;
const LANE_DX = 88;
const WIDTH = 600;
const DAY_SECONDS = 86400;
const MONTHS = [
    "JAN",
    "FEB",
    "MAR",
    "APR",
    "MAY",
    "JUN",
    "JUL",
    "AUG",
    "SEP",
    "OCT",
    "NOV",
    "DEC"
];
function orderBranches(commits) {
    const oldest = new Map();
    for (const commit of commits){
        const ts = commit.envelope.ts;
        const current = oldest.get(commit.envelope.branch);
        if (current === undefined || ts < current) {
            oldest.set(commit.envelope.branch, ts);
        }
    }
    return [
        ...oldest.entries()
    ].sort((a, b)=>a[1] - b[1]).map(([branch])=>branch);
}
function branchColorMap(branches) {
    const map = new Map();
    branches.forEach((branch, index)=>{
        map.set(branch, (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$lib$2f$format$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["branchColor"])(index));
    });
    return map;
}
function buildGraph(commits, branchOrder, nowSeconds) {
    const colors = branchColorMap(branchOrder);
    const sorted = [
        ...commits
    ].sort((a, b)=>b.envelope.ts - a.envelope.ts);
    const rows = new Map();
    sorted.forEach((commit, row)=>{
        rows.set(commit.envelope.commitHash, row);
    });
    const height = TOP + sorted.length * ROW_H + 8;
    const yOf = (hash)=>TOP + (rows.get(hash) ?? 0) * ROW_H + 18;
    if (sorted.length === 0) {
        return {
            width: WIDTH,
            height: TOP + 8,
            lanes: [],
            forks: [],
            ticks: [],
            nodes: [],
            head: null
        };
    }
    const laneX = new Map(branchOrder.map((branch, index)=>[
            branch,
            LANE_X0 + index * LANE_DX
        ]));
    const lanes = [];
    for (const branch of branchOrder){
        const laneNodes = sorted.filter((c)=>c.envelope.branch === branch);
        if (laneNodes.length === 0) {
            continue;
        }
        const first = laneNodes[0];
        const last = laneNodes[laneNodes.length - 1];
        lanes.push({
            branch,
            x: laneX.get(branch) ?? LANE_X0,
            y1: yOf(first.envelope.commitHash) - 22,
            y2: yOf(last.envelope.commitHash) + 22,
            color: colors.get(branch) ?? "#57564F"
        });
    }
    const byHash = new Map(sorted.map((c)=>[
            c.envelope.commitHash,
            c
        ]));
    const forks = [];
    for (const commit of sorted){
        const parentHash = commit.envelope.parent;
        if (parentHash === null) {
            continue;
        }
        const parent = byHash.get(parentHash);
        if (parent === undefined || parent.envelope.branch === commit.envelope.branch) {
            continue;
        }
        const x1 = laneX.get(parent.envelope.branch) ?? LANE_X0;
        const y1 = yOf(parentHash);
        const x2 = laneX.get(commit.envelope.branch) ?? LANE_X0;
        const y2 = yOf(commit.envelope.commitHash);
        const c = (y1 - y2) * 0.45;
        forks.push({
            d: `M ${x1} ${y1} C ${x1} ${(y1 - c).toFixed(1)}, ${x2} ${(y2 + c).toFixed(1)}, ${x2} ${y2}`,
            color: colors.get(commit.envelope.branch) ?? "#57564F"
        });
    }
    const minTs = Math.min(...sorted.map((c)=>c.envelope.ts));
    const maxTs = Math.max(nowSeconds, ...sorted.map((c)=>c.envelope.ts));
    const spanDays = Math.max((maxTs - minTs) / DAY_SECONDS, 0.5);
    const ticks = [];
    const firstDay = new Date(minTs * 1000);
    let cursor = Date.UTC(firstDay.getUTCFullYear(), firstDay.getUTCMonth(), firstDay.getUTCDate()) / 1000 + DAY_SECONDS;
    while(cursor <= maxTs + DAY_SECONDS){
        const y = TOP + (maxTs - cursor) / DAY_SECONDS * (height - TOP - 24) / spanDays + 2;
        if (y > TOP - 6 && y < height - 10) {
            const d = new Date(cursor * 1000);
            const label = `${String(d.getUTCDate()).padStart(2, "0")} ${MONTHS[d.getUTCMonth()]}`;
            ticks.push({
                y: Number(y.toFixed(1)),
                label
            });
        }
        cursor += DAY_SECONDS;
    }
    const nodes = sorted.map((commit, row)=>({
            id: commit.envelope.commitHash,
            branch: commit.envelope.branch,
            kind: commit.envelope.kind,
            invalid: commit.status === "invalid",
            summary: commit.body?.summary ?? `${commit.envelope.kind} commit`,
            ts: commit.envelope.ts,
            x: laneX.get(commit.envelope.branch) ?? LANE_X0,
            y: yOf(commit.envelope.commitHash),
            row,
            color: colors.get(commit.envelope.branch) ?? "#57564F"
        }));
    const headCommit = sorted[0];
    const head = {
        x: (laneX.get(headCommit.envelope.branch) ?? LANE_X0) + 16,
        y: yOf(headCommit.envelope.commitHash) + 3,
        branch: headCommit.envelope.branch
    };
    return {
        width: WIDTH,
        height,
        lanes,
        forks,
        ticks,
        nodes,
        head
    };
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/frontend/lib/live.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "RepoNotFoundError",
    ()=>RepoNotFoundError,
    "fetchLiveData",
    ()=>fetchLiveData
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$arkiv$2d$network$2b$sdk$40$0$2e$8$2e$1_typescript$40$7$2e$0$2e$2_viem$40$2$2e$57$2e$7_typescript$40$7$2e$0$2e$2_zod$40$4$2e$6$2e$7_$2f$node_modules$2f40$arkiv$2d$network$2f$sdk$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@arkiv-network+sdk@0.8.1_typescript@7.0.2_viem@2.57.7_typescript@7.0.2_zod@4.6.7_/node_modules/@arkiv-network/sdk/dist/index.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$arkiv$2d$network$2b$sdk$40$0$2e$8$2e$1_typescript$40$7$2e$0$2e$2_viem$40$2$2e$57$2e$7_typescript$40$7$2e$0$2e$2_zod$40$4$2e$6$2e$7_$2f$node_modules$2f40$arkiv$2d$network$2f$sdk$2f$dist$2f$chains$2d$DmrgfF3p$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__n__as__tiramisu$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@arkiv-network+sdk@0.8.1_typescript@7.0.2_viem@2.57.7_typescript@7.0.2_zod@4.6.7_/node_modules/@arkiv-network/sdk/dist/chains-DmrgfF3p.js [app-client] (ecmascript) <export n as tiramisu>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$arkiv$2d$network$2b$sdk$40$0$2e$8$2e$1_typescript$40$7$2e$0$2e$2_viem$40$2$2e$57$2e$7_typescript$40$7$2e$0$2e$2_zod$40$4$2e$6$2e$7_$2f$node_modules$2f40$arkiv$2d$network$2f$sdk$2f$dist$2f$query$2d$Ber$2d$lOJQ$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__i__as__and$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@arkiv-network+sdk@0.8.1_typescript@7.0.2_viem@2.57.7_typescript@7.0.2_zod@4.6.7_/node_modules/@arkiv-network/sdk/dist/query-Ber-lOJQ.js [app-client] (ecmascript) <export i as and>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$arkiv$2d$network$2b$sdk$40$0$2e$8$2e$1_typescript$40$7$2e$0$2e$2_viem$40$2$2e$57$2e$7_typescript$40$7$2e$0$2e$2_zod$40$4$2e$6$2e$7_$2f$node_modules$2f40$arkiv$2d$network$2f$sdk$2f$dist$2f$query$2d$Ber$2d$lOJQ$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__a__as__eq$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@arkiv-network+sdk@0.8.1_typescript@7.0.2_viem@2.57.7_typescript@7.0.2_zod@4.6.7_/node_modules/@arkiv-network/sdk/dist/query-Ber-lOJQ.js [app-client] (ecmascript) <export a as eq>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$viem$40$2$2e$57$2e$7_typescript$40$7$2e$0$2e$2_zod$40$4$2e$6$2e$7$2f$node_modules$2f$viem$2f$_esm$2f$clients$2f$transports$2f$http$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/viem@2.57.7_typescript@7.0.2_zod@4.6.7/node_modules/viem/_esm/clients/transports/http.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$lib$2f$crypto$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/lib/crypto.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$lib$2f$verify$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/lib/verify.ts [app-client] (ecmascript)");
;
;
;
;
;
;
const KINDS = [
    "scratch",
    "note",
    "decision",
    "milestone"
];
let client = null;
function getClient() {
    if (client === null) {
        client = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$arkiv$2d$network$2b$sdk$40$0$2e$8$2e$1_typescript$40$7$2e$0$2e$2_viem$40$2$2e$57$2e$7_typescript$40$7$2e$0$2e$2_zod$40$4$2e$6$2e$7_$2f$node_modules$2f40$arkiv$2d$network$2f$sdk$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createPublicClient"])({
            chain: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$arkiv$2d$network$2b$sdk$40$0$2e$8$2e$1_typescript$40$7$2e$0$2e$2_viem$40$2$2e$57$2e$7_typescript$40$7$2e$0$2e$2_zod$40$4$2e$6$2e$7_$2f$node_modules$2f40$arkiv$2d$network$2f$sdk$2f$dist$2f$chains$2d$DmrgfF3p$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__n__as__tiramisu$3e$__["tiramisu"],
            transport: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$viem$40$2$2e$57$2e$7_typescript$40$7$2e$0$2e$2_zod$40$4$2e$6$2e$7$2f$node_modules$2f$viem$2f$_esm$2f$clients$2f$transports$2f$http$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["http"])()
        });
    }
    return client;
}
function toNumber(value) {
    if (value === undefined) {
        return 0;
    }
    return typeof value === "bigint" ? Number(value) : value;
}
function attrValue(entity, name) {
    const value = entity.attributes?.[name];
    if (value !== undefined && typeof value === "object" && value !== null && "value" in value) {
        return value.value;
    }
    if (typeof value === "string" || typeof value === "number" || typeof value === "bigint") {
        return value;
    }
    return undefined;
}
function parseEnvelope(payload) {
    const raw = JSON.parse(payload);
    if (raw.v !== 1) {
        throw new Error(`unsupported envelope version: ${String(raw.v)}`);
    }
    for (const key of [
        "repoId",
        "branch",
        "author",
        "kind",
        "nonce",
        "ciphertext",
        "commitHash",
        "sig"
    ]){
        if (typeof raw[key] !== "string") {
            throw new Error(`envelope field ${key} must be a string`);
        }
    }
    if (typeof raw.ts !== "number" || !Number.isFinite(raw.ts)) {
        throw new Error("envelope field ts must be a finite number");
    }
    if (raw.parent !== null && typeof raw.parent !== "string") {
        throw new Error("envelope field parent must be a string or null");
    }
    if (!KINDS.includes(raw.kind)) {
        throw new Error(`unknown commit kind: ${String(raw.kind)}`);
    }
    if (typeof raw.agent !== "string" || raw.agent === "") {
        throw new Error("envelope field agent must be a non-empty string");
    }
    return raw;
}
class RepoNotFoundError extends Error {
    constructor(repoId){
        super(`no repo entity found for id ${repoId}`);
        this.name = "RepoNotFoundError";
    }
}
async function fetchLiveData(repoId, groupKey) {
    const pub = getClient();
    const timing = await pub.getBlockTiming();
    const blockTiming = {
        currentBlock: toNumber(timing.currentBlock),
        currentBlockTime: timing.currentBlockTime,
        blockDuration: timing.blockDuration
    };
    const repoPage = await pub.select("*").where((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$arkiv$2d$network$2b$sdk$40$0$2e$8$2e$1_typescript$40$7$2e$0$2e$2_viem$40$2$2e$57$2e$7_typescript$40$7$2e$0$2e$2_zod$40$4$2e$6$2e$7_$2f$node_modules$2f40$arkiv$2d$network$2f$sdk$2f$dist$2f$query$2d$Ber$2d$lOJQ$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__i__as__and$3e$__["and"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$arkiv$2d$network$2b$sdk$40$0$2e$8$2e$1_typescript$40$7$2e$0$2e$2_viem$40$2$2e$57$2e$7_typescript$40$7$2e$0$2e$2_zod$40$4$2e$6$2e$7_$2f$node_modules$2f40$arkiv$2d$network$2f$sdk$2f$dist$2f$query$2d$Ber$2d$lOJQ$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__a__as__eq$3e$__["eq"])("type", "repo"), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$arkiv$2d$network$2b$sdk$40$0$2e$8$2e$1_typescript$40$7$2e$0$2e$2_viem$40$2$2e$57$2e$7_typescript$40$7$2e$0$2e$2_zod$40$4$2e$6$2e$7_$2f$node_modules$2f40$arkiv$2d$network$2f$sdk$2f$dist$2f$query$2d$Ber$2d$lOJQ$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__a__as__eq$3e$__["eq"])("repo_id", repoId))).limit(1).fetch();
    const repoEntity = repoPage.entities[0];
    if (repoEntity === undefined) {
        throw new RepoNotFoundError(repoId);
    }
    const repoJson = repoEntity.toJson();
    const repo = {
        id: repoId,
        name: typeof repoJson.name === "string" ? repoJson.name : repoId,
        owner: repoEntity.owner,
        members: Array.isArray(repoJson.members) ? repoJson.members.filter((m)=>typeof m === "string") : [],
        entityKey: repoEntity.key,
        createdAtBlock: toNumber(repoEntity.createdAt),
        expiresAtBlock: toNumber(repoEntity.expiresAt)
    };
    const branches = [];
    for await (const entity of pub.select("*").where((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$arkiv$2d$network$2b$sdk$40$0$2e$8$2e$1_typescript$40$7$2e$0$2e$2_viem$40$2$2e$57$2e$7_typescript$40$7$2e$0$2e$2_zod$40$4$2e$6$2e$7_$2f$node_modules$2f40$arkiv$2d$network$2f$sdk$2f$dist$2f$query$2d$Ber$2d$lOJQ$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__i__as__and$3e$__["and"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$arkiv$2d$network$2b$sdk$40$0$2e$8$2e$1_typescript$40$7$2e$0$2e$2_viem$40$2$2e$57$2e$7_typescript$40$7$2e$0$2e$2_zod$40$4$2e$6$2e$7_$2f$node_modules$2f40$arkiv$2d$network$2f$sdk$2f$dist$2f$query$2d$Ber$2d$lOJQ$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__a__as__eq$3e$__["eq"])("type", "branch"), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$arkiv$2d$network$2b$sdk$40$0$2e$8$2e$1_typescript$40$7$2e$0$2e$2_viem$40$2$2e$57$2e$7_typescript$40$7$2e$0$2e$2_zod$40$4$2e$6$2e$7_$2f$node_modules$2f40$arkiv$2d$network$2f$sdk$2f$dist$2f$query$2d$Ber$2d$lOJQ$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__a__as__eq$3e$__["eq"])("repo_id", repoId)))){
        const raw = entity;
        const name = attrValue(raw, "name");
        const head = attrValue(raw, "head");
        const forkedFrom = attrValue(raw, "forked_from");
        const owner = attrValue(raw, "owner");
        branches.push({
            key: raw.key,
            name: typeof name === "string" ? name : "",
            owner: typeof owner === "string" ? owner : raw.owner,
            head: typeof head === "string" ? head : "",
            forkedFrom: typeof forkedFrom === "string" ? forkedFrom : null,
            createdAtBlock: toNumber(raw.createdAt),
            expiresAtBlock: toNumber(raw.expiresAt)
        });
    }
    branches.sort((a, b)=>a.createdAtBlock - b.createdAtBlock);
    const commits = [];
    for await (const entity of pub.select("*").where((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$arkiv$2d$network$2b$sdk$40$0$2e$8$2e$1_typescript$40$7$2e$0$2e$2_viem$40$2$2e$57$2e$7_typescript$40$7$2e$0$2e$2_zod$40$4$2e$6$2e$7_$2f$node_modules$2f40$arkiv$2d$network$2f$sdk$2f$dist$2f$query$2d$Ber$2d$lOJQ$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__i__as__and$3e$__["and"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$arkiv$2d$network$2b$sdk$40$0$2e$8$2e$1_typescript$40$7$2e$0$2e$2_viem$40$2$2e$57$2e$7_typescript$40$7$2e$0$2e$2_zod$40$4$2e$6$2e$7_$2f$node_modules$2f40$arkiv$2d$network$2f$sdk$2f$dist$2f$query$2d$Ber$2d$lOJQ$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__a__as__eq$3e$__["eq"])("type", "commit"), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$arkiv$2d$network$2b$sdk$40$0$2e$8$2e$1_typescript$40$7$2e$0$2e$2_viem$40$2$2e$57$2e$7_typescript$40$7$2e$0$2e$2_zod$40$4$2e$6$2e$7_$2f$node_modules$2f40$arkiv$2d$network$2f$sdk$2f$dist$2f$query$2d$Ber$2d$lOJQ$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__a__as__eq$3e$__["eq"])("repo_id", repoId)))){
        const raw = entity;
        let envelope;
        try {
            envelope = parseEnvelope(raw.toText());
        } catch  {
            continue;
        }
        const verified = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$lib$2f$verify$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["verifyEnvelope"])(envelope, {
            owner: raw.owner,
            members: repo.members
        });
        let body = null;
        let locked = false;
        if (verified.ok) {
            if (groupKey !== null) {
                try {
                    body = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$lib$2f$crypto$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["decryptBody"])(envelope.nonce, envelope.ciphertext, groupKey);
                } catch  {
                    locked = true;
                }
            } else {
                locked = true;
            }
        }
        commits.push({
            id: envelope.commitHash,
            entityKey: raw.key,
            owner: raw.owner,
            envelope,
            body,
            locked,
            status: verified.ok ? "verified" : "invalid",
            reason: verified.reason,
            detail: verified.detail,
            checks: verified.checks,
            createdAtBlock: toNumber(raw.createdAt),
            expiresAtBlock: toNumber(raw.expiresAt)
        });
    }
    commits.sort((a, b)=>b.envelope.ts - a.envelope.ts);
    return {
        source: "live",
        repo,
        branches,
        commits,
        blockTiming,
        labels: {}
    };
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/frontend/lib/types.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "COMMIT_KINDS",
    ()=>COMMIT_KINDS,
    "KIND_EXPIRY_DAYS",
    ()=>KIND_EXPIRY_DAYS
]);
const COMMIT_KINDS = [
    "scratch",
    "note",
    "decision",
    "milestone"
];
const KIND_EXPIRY_DAYS = {
    scratch: 3,
    note: 14,
    decision: 90,
    milestone: 365
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/frontend/lib/verify.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "verifyEnvelope",
    ()=>verifyEnvelope
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$lib$2f$crypto$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/lib/crypto.ts [app-client] (ecmascript)");
;
const norm = (address)=>address.toLowerCase();
async function verifyEnvelope(envelope, ctx = {}) {
    const recomputed = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$lib$2f$crypto$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["computeCommitHash"])({
        v: 1,
        repoId: envelope.repoId,
        branch: envelope.branch,
        parent: envelope.parent,
        author: envelope.author,
        kind: envelope.kind,
        ts: envelope.ts,
        nonce: envelope.nonce,
        ciphertextHash: (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$lib$2f$crypto$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ciphertextHash"])(envelope.ciphertext)
    });
    const hashOk = norm(recomputed) === norm(envelope.commitHash);
    let recovered = null;
    try {
        recovered = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$lib$2f$crypto$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["recoverAuthor"])(envelope.commitHash, envelope.sig);
    } catch  {
        recovered = null;
    }
    const sigOk = recovered !== null && norm(recovered) === norm(envelope.author);
    const ownerOk = ctx.owner === undefined ? null : norm(ctx.owner) === norm(envelope.author);
    const memberOk = ctx.members === undefined ? null : ctx.members.some((m)=>norm(m) === norm(envelope.author));
    const checks = {
        hash: hashOk,
        sig: sigOk,
        owner: ownerOk,
        member: memberOk
    };
    if (!hashOk) {
        return {
            ok: false,
            reason: "BAD_HASH",
            detail: `recomputed ${recomputed} != envelope ${envelope.commitHash}`,
            checks
        };
    }
    if (!sigOk) {
        return {
            ok: false,
            reason: "BAD_SIGNATURE",
            detail: recovered === null ? "signature could not be recovered to an address" : `signature recovers ${recovered}, envelope says ${envelope.author}`,
            checks
        };
    }
    if (ownerOk === false) {
        return {
            ok: false,
            reason: "OWNER_MISMATCH",
            detail: `entity owner ${ctx.owner} != author ${envelope.author}`,
            checks
        };
    }
    if (memberOk === false) {
        return {
            ok: false,
            reason: "NOT_MEMBER",
            detail: `author ${envelope.author} is not in the repo member list`,
            checks
        };
    }
    return {
        ok: true,
        checks
    };
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);})()

//# sourceMappingURL=frontend_0mw27vqu5ulcd._.js.map