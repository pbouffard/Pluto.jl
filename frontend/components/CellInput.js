import { html, useState, useEffect, useLayoutEffect, useRef } from "../common/Preact.js"
import observablehq_for_myself from "../common/SetupCellEnvironment.js"

import { utf8index_to_ut16index } from "../common/UnicodeTools.js"
import { map_cmd_to_ctrl_on_mac } from "../common/KeyboardShortcuts.js"

const clear_selection = (cm) => {
    const c = cm.getCursor()
    cm.setSelection(c, c, { scroll: false })
}

const last = (x) => x[x.length - 1]
const all_equal = (x) => x.every((y) => y === x[0])

export const CellInput = ({
    is_hidden,
    local_code,
    remote_code,
    disable_input,
    focus_after_creation,
    scroll_into_view_after_creation,
    cm_forced_focus,
    set_cm_forced_focus,
    on_submit,
    on_delete,
    on_add_after,
    on_fold,
    on_change,
    on_update_doc_query,
    on_focus_neighbor,
    client,
    cell_id,
    notebook_id,
}) => {
    const cm_ref = useRef(null)
    const dom_node_ref = useRef(null)
    const remote_code_ref = useRef(null)
    const change_handler_ref = useRef(null)
    change_handler_ref.current = on_change

    useEffect(() => {
        remote_code_ref.current = remote_code
    }, [remote_code])

    useEffect(() => {
        if (!is_hidden) {
            const cm = (cm_ref.current = window.CodeMirror(
                (el) => {
                    dom_node_ref.current.appendChild(el)
                },
                {
                    value: local_code.body,
                    lineNumbers: true,
                    mode: "julia",
                    lineWrapping: true,
                    viewportMargin: Infinity,
                    placeholder: "Enter cell code...",
                    indentWithTabs: true,
                    indentUnit: 4,
                    hintOptions: {
                        hint: juliahints,
                        client: client,
                        notebook_id: notebook_id,
                        on_update_doc_query: on_update_doc_query,
                        extraKeys: {
                            ".": (cm, { pick }) => {
                                pick()
                                cm.replaceSelection(".")
                                cm.showHint()
                            },
                            // "(": (cm, { pick }) => pick(),
                        },
                    },
                    matchBrackets: true,
                }
            ))

            const keys = {}

            keys["Shift-Enter"] = () => on_submit(cm.getValue())
            keys["Ctrl-Enter"] = () => {
                on_add_after()

                const new_value = cm.getValue()
                if (new_value !== remote_code_ref.current.body) {
                    on_submit(new_value)
                }
            }
            // Page up and page down are fn+Up and fn+Down on recent apple keyboards
            keys["PageUp"] = () => {
                on_focus_neighbor(cell_id, -1)
            }
            keys["PageDown"] = () => {
                on_focus_neighbor(cell_id, +1)
            }
            keys["Shift-Tab"] = "indentLess"
            keys["Tab"] = on_tab_key
            keys["Ctrl-Space"] = () => cm.showHint()
            keys["Ctrl-D"] = () => {
                if (cm.somethingSelected()) {
                    const sels = cm.getSelections()
                    cm.execCommand("selectNextOccurrence");
                } else {
                    const cursor = cm.getCursor()
                    const token = cm.getTokenAt(cursor)
                    cm.setSelection({ line: cursor.line, ch: token.start }, { line: cursor.line, ch: token.end })
                }
            }
            keys["Ctrl-/"] = () => {
                const old_value = cm.getValue()
                cm.toggleComment({ indent: true })
                const new_value = cm.getValue()
                if (old_value === new_value) {
                    // the commenter failed for some reason
                    // this happens when lines start with `md"`, with no indent
                    cm.setValue(cm.lineCount() === 1 ? `# ${new_value}` : `#= ${new_value} =#`)
                    cm.execCommand("selectAll")
                }
            }
            keys["Ctrl-M"] = () => {
                const value = cm.getValue()
                const trimmed = value.trim()
                const offset = value.length - value.trimStart().length
                if (trimmed.startsWith('md"') && trimmed.endsWith('"')) {
                    // Markdown cell, change to code
                    let start, end
                    if (trimmed.startsWith('md"""') && trimmed.endsWith('"""')) {
                        // Block markdown
                        start = 5
                        end = trimmed.length - 3
                    } else {
                        // Inline markdown
                        start = 3
                        end = trimmed.length - 1
                    }
                    if (start >= end || trimmed.substring(start, end).trim() == "") {
                        // Corner case: block is empty after removing markdown
                        cm.setValue("")
                    } else {
                        while (/\s/.test(trimmed[start])) {
                            ++start
                        }
                        while (/\s/.test(trimmed[end - 1])) {
                            --end
                        }
                        // Keep the selection from [start, end) while maintaining cursor position
                        cm.replaceRange("", cm.posFromIndex(end + offset), { line: cm.lineCount() })
                        cm.replaceRange("", { line: 0, ch: 0 }, cm.posFromIndex(start + offset))
                    }
                } else {
                    // Code cell, change to markdown
                    const old_selections = cm.listSelections()
                    cm.setValue(`md"""\n${value}\n"""`)
                    // Move all selections down a line
                    const new_selections = old_selections.map(({ anchor, head }) => {
                        return {
                            anchor: { ...anchor, line: anchor.line + 1 },
                            head: { ...head, line: head.line + 1 },
                        }
                    })
                    cm.setSelections(new_selections)
                }
            }
            function duplicate_up_down(duplicate_up) {
                // based on https://stackoverflow.com/a/53865581/633083
                var current_cursor = cm.doc.getCursor();
                cm.execCommand("goLineEnd")
                cm.execCommand("goLineStart");
                var start_cursor = cm.doc.getCursor();
                var start = {'line': start_cursor.line, 'ch': start_cursor.ch};
                cm.execCommand("goLineEnd")
                var end_cursor = cm.doc.getCursor();
                var end = {'line': end_cursor.line, 'ch': end_cursor.ch};
                var line_content = cm.doc.getRange(start, end);
                if (duplicate_up) {
                    cm.doc.setCursor(current_cursor.line, current_cursor.ch);
                    cm.execCommand("goLineStart");
                    cm.execCommand("newLineAndIndent")
                    cm.doc.replaceSelection(line_content);
                    cm.doc.replaceSelection("\n");
                    cm.doc.setCursor(current_cursor.line, current_cursor.ch);
                } else {
                    cm.doc.setCursor(current_cursor.line, current_cursor.ch);
                    cm.execCommand("goLineEnd");
                    cm.execCommand("newLineAndIndent")
                    cm.doc.replaceSelection("\n");
                    cm.doc.replaceSelection(line_content);
                    cm.doc.setCursor(current_cursor.line + 1, current_cursor.ch);
                }
            }
            keys["Shift-Alt-Up"] = () => {
                duplicate_up_down(true);
            }
            keys["Shift-Alt-Down"] = () => {
                duplicate_up_down(false);
            }
            keys["Shift-Alt-F"]  = () => {
                cm.execCommand("indentAuto");
            }
            keys["Alt-Z"]  = () => {
                cm.setOption("lineWrapping", !cm.getOption("lineWrapping"));
            }
            const swap = (a, i, j) => {
                ;[a[i], a[j]] = [a[j], a[i]]
            }
            const range = (a, b) => {
                const x = Math.min(a, b)
                const y = Math.max(a, b)
                return [...Array(y + 1 - x).keys()].map((i) => i + x)
            }
            const alt_move = (delta) => {
                const selections = cm.listSelections()
                const selected_lines = new Set([].concat(...selections.map((sel) => range(sel.anchor.line, sel.head.line))))
                const final_line_number = delta === 1 ? cm.lineCount() - 1 : 0
                if (!selected_lines.has(final_line_number)) {
                    Array.from(selected_lines)
                        .sort((a, b) => delta * a < delta * b)
                        .forEach((line_number) => {
                            const lines = cm.getValue().split("\n")
                            swap(lines, line_number, line_number + delta)
                            cm.setValue(lines.join("\n"))
                            cm.indentLine(line_number + delta, "smart")
                            cm.indentLine(line_number, "smart")
                        })
                    cm.setSelections(
                        selections.map((sel) => {
                            return {
                                head: {
                                    line: sel.head.line + delta,
                                    ch: sel.head.ch,
                                },
                                anchor: {
                                    line: sel.anchor.line + delta,
                                    ch: sel.anchor.ch,
                                },
                            }
                        })
                    )
                }
            }
            keys["Alt-Up"] = () => alt_move(-1)
            keys["Alt-Down"] = () => alt_move(+1)

            keys["Backspace"] = keys["Ctrl-Backspace"] = () => {
                if (cm.lineCount() === 1 && cm.getValue() === "") {
                    on_focus_neighbor(cell_id, -1)
                    on_delete()
                }
                return window.CodeMirror.Pass
            }
            keys["Delete"] = keys["Ctrl-Delete"] = () => {
                if (cm.lineCount() === 1 && cm.getValue() === "") {
                    on_focus_neighbor(cell_id, +1)
                    on_delete()
                }
                return window.CodeMirror.Pass
            }

            cm.setOption("extraKeys", map_cmd_to_ctrl_on_mac(keys))
            cm.setOption("autoCloseBrackets", true)

            cm.on("cursorActivity", () => {
                if (cm.somethingSelected()) {
                    const sel = cm.getSelection()
                    if (!/[\s]/.test(sel)) {
                        // no whitespace
                        on_update_doc_query(sel)
                    }
                } else {
                    const cursor = cm.getCursor()
                    const token = cm.getTokenAt(cursor)
                    if (token.start === 0 && token.type === "operator" && token.string === "?") {
                        // https://github.com/fonsp/Pluto.jl/issues/321
                        const second_token = cm.getTokenAt({ ...cursor, ch: 2 })
                        on_update_doc_query(second_token.string)
                    } else if (token.type != null && token.type !== "string") {
                        on_update_doc_query(module_expanded_selection(cm, token.string, cursor.line, token.start))
                    }
                }
            })

            cm.on("change", (_, e) => {
                const new_value = cm.getValue()
                if (new_value.length > 1 && new_value[0] === "?") {
                    window.dispatchEvent(new CustomEvent("open_live_docs"))
                }
                change_handler_ref.current(new_value)
            })

            cm.on("blur", () => {
                // NOT a debounce:
                setTimeout(() => {
                    if (document.hasFocus()) {
                        clear_selection(cm)
                        set_cm_forced_focus(null)
                    }
                }, 100)
            })

            if (focus_after_creation) {
                cm.focus()
            }
            if (scroll_into_view_after_creation) {
                dom_node_ref.current.scrollIntoView()
            }

            document.fonts.ready.then(() => {
                cm.refresh()
            })
        } else {
            if (cm_ref.current != null) {
                const cm_wrapper = cm_ref.current.getWrapperElement()
                cm_wrapper.parentNode.removeChild(cm_wrapper)
                cm_ref.current = null
            }
        }
    }, [is_hidden])

    useEffect(() => {
        if (!is_hidden) {
            if (!remote_code.submitted_by_me) {
                cm_ref.current.setValue(remote_code.body)
            }
            cm_ref.current.options.disableInput = disable_input
        }
    }, [remote_code.timestamp])

    useEffect(() => {
        if (!is_hidden) {
            if (cm_forced_focus == null) {
                clear_selection(cm_ref.current)
            } else {
                cm_ref.current.focus()
                cm_ref.current.setSelection(...cm_forced_focus)
            }
        }
    }, [cm_forced_focus])

    // TODO effect hook for disable_input?

    return html`
        <pluto-input ref=${dom_node_ref}>
            <button onClick=${on_delete} class="delete_cell" title="Delete cell"><span></span></button>
        </pluto-input>
    `
}

function isSelectedRange(ranges, from, to) {
    for (var i = 0; i < ranges.length; i++) {
      if (ranges[i].from() == from && ranges[i].to() == to) {
          return true;
      }
      if (CodeMirror.cmpPos(ranges[i].from(), from) == 0 &&
          CodeMirror.cmpPos(ranges[i].to(), to) == 0) {
              return true;
      }
    }
    return false;
  }

CodeMirror.commands.selectNextOccurrence = function(cm) {
    var from = cm.getCursor("from"), to = cm.getCursor("to");
    var fullWord = cm.state.sublimeFindFullWord == cm.doc.sel;
    if (CodeMirror.cmpPos(from, to) == 0) {
      var word = wordAt(cm, from);
      if (!word.word) return;
      cm.setSelection(word.from, word.to);
      fullWord = true;
    } else {
      var text = cm.getRange(from, to);
      var query = fullWord ? new RegExp("\\b" + text + "\\b") : text;
      var cur = cm.getSearchCursor(query, to);
      var found = cur.findNext();
      if (!found) {
        cur = cm.getSearchCursor(query, CodeMirror.Pos(cm.firstLine(), 0));
        found = cur.findNext();
      }
      if (!found || isSelectedRange(cm.listSelections(), cur.from(), cur.to())) return
      cm.addSelection(cur.from(), cur.to());
    }
    if (fullWord)
      cm.state.sublimeFindFullWord = cm.doc.sel;
  };

const no_autocomplete = " \t\r\n([])+-=/,;'\"!#$%^&*~`<>|"

const on_tab_key = (cm) => {
    const cursor = cm.getCursor()
    const old_line = cm.getLine(cursor.line)

    if (cm.somethingSelected()) {
        cm.indentSelection()
    } else {
        if (cursor.ch > 0 && no_autocomplete.indexOf(old_line[cursor.ch - 1]) == -1) {
            cm.showHint()
        } else {
            cm.replaceSelection("\t")
        }
    }
}

const juliahints = (cm, options) => {
    const cursor = cm.getCursor()
    const old_line = cm.getLine(cursor.line)
    const old_line_sliced = old_line.slice(0, cursor.ch)

    return options.client
        .send(
            "complete",
            {
                query: old_line_sliced,
            },
            {
                notebook_id: options.notebook_id,
            }
        )
        .then(({ message }) => {
            const completions = {
                list: message.results.map(([text, type_description, is_exported]) => ({
                    text: text,
                    className: (is_exported ? "" : "c_notexported ") + (type_description == null ? "" : "c_" + type_description),
                    // render: (el) => el.appendChild(observablehq_for_myself.html`<div></div>`),
                })),
                from: window.CodeMirror.Pos(cursor.line, utf8index_to_ut16index(old_line, message.start)),
                to: window.CodeMirror.Pos(cursor.line, utf8index_to_ut16index(old_line, message.stop)),
            }
            window.CodeMirror.on(completions, "select", (val) => {
                options.on_update_doc_query(module_expanded_selection(cm, val.text, cursor.line, completions.from.ch))
            })
            return completions
        })
}

// https://github.com/fonsp/Pluto.jl/issues/239
const module_expanded_selection = (cm, current, line, ch) => {
    const next1 = cm.getTokenAt({ line: line, ch: ch })
    if (next1.string === ".") {
        const next2 = cm.getTokenAt({ line: line, ch: ch - 1 })
        if (next2.type === "variable") {
            return module_expanded_selection(cm, next2.string + "." + current, line, next2.start)
        } else {
            return current
        }
    } else {
        return current
    }
}
