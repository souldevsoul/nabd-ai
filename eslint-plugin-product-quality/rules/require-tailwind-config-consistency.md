# require-tailwind-config-consistency

## Что проверяет

Это правило обеспечивает соответствие конфигурации Tailwind CSS версии, которая используется в проекте.

## Проблема

**Tailwind CSS v4 кардинально изменил способ конфигурации:**

- **v3**: Конфигурация в `tailwind.config.js` через `module.exports = { theme: { extend: { colors: {...} } } }`
- **v4**: Конфигурация в CSS через директиву `@theme { --color-*: #hex; }`

**Критическая проблема**: При использовании Tailwind v4 файл `tailwind.config.js` **полностью игнорируется**!

## Обнаруженные сценарии

### ❌ Ошибка 1: Tailwind v4 с JS-конфигурацией
```
Tailwind CSS v4 detected (@import "tailwindcss" in globals.css) 
but configuration found in tailwind.config.js. 
Tailwind v4 ignores JS config files. 
Move your custom colors to @theme directive in globals.css.
```

**Когда возникает:**
- В `postcss.config.mjs` используется `@tailwindcss/postcss`
- В `app/globals.css` есть `@import "tailwindcss"`
- В `tailwind.config.js` есть кастомные цвета (`extend.colors`)
- В `app/globals.css` НЕТ директивы `@theme`

**Последствия:**
- Кастомные цвета (например, `bg-coral-500`) не генерируются
- CSS классы отсутствуют в скомпилированном CSS
- Компоненты отображаются без стилей

**Решение:**
```css
/* app/globals.css */
@import "tailwindcss";

@theme {
  --color-coral-50: #FFF5F3;
  --color-coral-500: #FF7F50;
  --color-coral-900: #B23529;
}
```

### ❌ Ошибка 2: Tailwind v4 без @theme
```
Tailwind CSS v4 detected but no @theme directive found in app/globals.css.
Custom colors from tailwind.config.js will not be applied.
```

**Когда возникает:**
- Tailwind v4 обнаружен
- Есть кастомные цвета в `tailwind.config.js`
- НЕТ `@theme` в globals.css

### ❌ Ошибка 3: Tailwind v3 с @theme
```
Tailwind CSS v3 detected but @theme directive found in app/globals.css.
@theme is a v4 feature and will be ignored.
```

**Когда возникает:**
- В `globals.css` есть `@tailwind base; @tailwind components; @tailwind utilities;` (v3)
- В `globals.css` есть `@theme` (v4 директива)
- `@theme` будет проигнорирована

## Как определяется версия

**Tailwind v4 признаки:**
- `@tailwindcss/postcss` в `postcss.config.mjs`
- `@import "tailwindcss"` в globals.css

**Tailwind v3 признаки:**
- `@tailwind` директивы в globals.css
- НЕТ `@import "tailwindcss"`

## Примеры

### ✅ Правильно: Tailwind v4
```css
/* app/globals.css */
@import "tailwindcss";

@theme {
  --color-brand-500: #FF6B35;
  --color-accent-500: #004E89;
}
```

```javascript
// tailwind.config.js можно удалить или оставить пустым
```

### ✅ Правильно: Tailwind v3
```css
/* app/globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;
```

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        'brand-500': '#FF6B35',
        'accent-500': '#004E89',
      }
    }
  }
}
```

### ❌ Неправильно: Смешивание v3 и v4
```css
/* app/globals.css */
@import "tailwindcss";  /* v4 */

@theme {
  --color-brand-500: #FF6B35;
}
```

```javascript
// tailwind.config.js - БУДЕТ ПРОИГНОРИРОВАН!
module.exports = {
  theme: {
    extend: {
      colors: {
        'brand-500': '#FF6B35',  // Не применится!
      }
    }
  }
}
```

## История

Это правило было создано после реального инцидента в проекте PetPortrait AI (2025-11-20):

1. Проект использовал Tailwind v4 (`@import "tailwindcss"`)
2. Кастомные цвета были в `tailwind.config.js`
3. Footer с `bg-warm-gray-900` отображался светлым вместо тёмного
4. CSS класс `.bg-warm-gray-900` не генерировался
5. Причина: Tailwind v4 игнорировал `tailwind.config.js`
6. Решение: Добавили `@theme` в `globals.css`

## Связанные правила

- `require-text-color-contrast` - проверяет контрастность текста

## Источники

- [Tailwind CSS v4 Beta Docs](https://tailwindcss.com/docs/v4-beta)
- [Migrating to v4](https://tailwindcss.com/docs/v4-beta#migrating-from-v3)
