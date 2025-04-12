'use client'

import { useEffect } from 'react'
import { useState } from 'react'

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { COMMAND_PRIORITY_CRITICAL, SELECTION_CHANGE_COMMAND } from 'lexical'

import { ToolbarContext } from '@/components/editor/context/toolbar-context'

import { useEditorModal } from '@/components/editor/editor-hooks/use-modal'

export function ToolbarPlugin({
  children
}) {
  const [editor] = useLexicalComposerContext()

  const [activeEditor, setActiveEditor] = useState(editor)
  const [blockType, setBlockType] = useState('paragraph')

  const [modal, showModal] = useEditorModal()

  const $updateToolbar = () => {}

  useEffect(() => {
    return activeEditor.registerCommand(SELECTION_CHANGE_COMMAND, (_payload, newEditor) => {
      setActiveEditor(newEditor)
      return false
    }, COMMAND_PRIORITY_CRITICAL);
  }, [editor])

  return (
    <ToolbarContext
      activeEditor={activeEditor}
      $updateToolbar={$updateToolbar}
      blockType={blockType}
      setBlockType={setBlockType}
      showModal={showModal}>
      {modal}
      {children({ blockType })}
    </ToolbarContext>
  );
}
