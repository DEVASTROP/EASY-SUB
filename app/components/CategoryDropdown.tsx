'use client'

import { useState, useRef, useEffect } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { Category } from '@/types'
import { cn } from '@/lib/utils'
import { useLocale } from '@/lib/i18n/LocaleProvider'
import { localized } from '@/lib/i18n/format'

interface CategoryDropdownProps {
  categories: Category[]
  selectedCategory: string
  onSelect: (slug: string) => void
  className?: string
}

export function CategoryDropdown({ categories, selectedCategory, onSelect, className }: CategoryDropdownProps) {
  const { locale, t } = useLocale()
  const [isOpen, setIsOpen] = useState(false)
  const [highlightedIndex, setHighlightedIndex] = useState(-1)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const listRef = useRef<HTMLUListElement>(null)

  const selectedCategoryObj = categories.find(c => c.slug === selectedCategory)
  const selectedLabel = selectedCategoryObj ? localized(selectedCategoryObj, 'name', locale) : t.header.allCategories

  const allOptions = [
    { slug: '', label: t.header.allCategories },
    ...categories.map(c => ({ slug: c.slug, label: localized(c, 'name', locale) })),
  ]

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
        setHighlightedIndex(-1)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Handle keyboard navigation
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (!isOpen) return

      switch (event.key) {
        case 'Escape':
          setIsOpen(false)
          setHighlightedIndex(-1)
          buttonRef.current?.focus()
          break
        case 'ArrowDown':
          event.preventDefault()
          setHighlightedIndex(prev => Math.min(prev + 1, allOptions.length - 1))
          break
        case 'ArrowUp':
          event.preventDefault()
          setHighlightedIndex(prev => Math.max(prev - 1, 0))
          break
        case 'Enter':
        case ' ':
          event.preventDefault()
          if (highlightedIndex >= 0) {
            onSelect(allOptions[highlightedIndex].slug)
            setIsOpen(false)
            setHighlightedIndex(-1)
          }
          break
        case 'Tab':
          setIsOpen(false)
          setHighlightedIndex(-1)
          break
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, highlightedIndex, allOptions, onSelect])

  // Scroll highlighted option into view
  useEffect(() => {
    if (highlightedIndex >= 0 && listRef.current) {
      const option = listRef.current.children[highlightedIndex] as HTMLElement
      if (option) {
        option.scrollIntoView({ block: 'nearest' })
      }
    }
  }, [highlightedIndex])

  const handleOptionClick = (slug: string) => {
    onSelect(slug)
    setIsOpen(false)
    setHighlightedIndex(-1)
  }

  return (
    <div className={cn('relative inline-block', className)} ref={dropdownRef}>
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 h-11 px-3 bg-white rounded-full shadow-sm text-foreground hover:bg-accent/50 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={t.header.selectCategory}
      >
        <span className="text-sm truncate max-w-[160px]">{selectedLabel}</span>
        {isOpen ? <ChevronUp className="w-4 h-4 text-muted-foreground flex-shrink-0" /> : <ChevronDown className="w-4 h-4 text-muted-foreground flex-shrink-0" />}
      </button>

      {isOpen && (
        <ul
          ref={listRef}
          role="listbox"
          aria-label={t.header.categories}
          className="absolute right-0 z-50 mt-2 w-[240px] bg-surface rounded-xl shadow-lg border border-border overflow-hidden max-h-64 overflow-auto"
        >
          {allOptions.map((option, index) => (
            <li
              key={option.slug || 'all'}
              role="option"
              aria-selected={option.slug === selectedCategory}
              onClick={() => handleOptionClick(option.slug)}
              onMouseEnter={() => setHighlightedIndex(index)}
              className={cn(
                'px-3 py-2 text-sm cursor-pointer transition-colors',
                option.slug === selectedCategory
                  ? 'bg-primary/10 text-primary font-medium'
                  : 'text-foreground hover:bg-accent/50',
                index === highlightedIndex && 'bg-accent/50'
              )}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}