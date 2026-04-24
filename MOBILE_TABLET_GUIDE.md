# Mobile & Tablet Responsive Design Guide

## Quick Reference for Developers

### Breakpoint Cheat Sheet

```
Mobile:  < 640px  (sm)
Tablet:  640px - 1023px  (sm, md)
Desktop: 1024px+  (lg, xl)
```

### Common Responsive Patterns

#### 1. Padding/Margins
```jsx
// Mobile-first approach
className="px-4 sm:px-6 md:px-8 lg:px-12"
className="py-6 sm:py-8 md:py-12"
className="gap-4 sm:gap-6 md:gap-8"
```

#### 2. Text Sizing
```jsx
// Headings
className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl"

// Body text
className="text-sm sm:text-base md:text-lg"

// Small text
className="text-xs sm:text-sm"
```

#### 3. Grid Layouts
```jsx
// 1 column mobile, 2 tablet, 3+ desktop
className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"

// 2 columns mobile, 3 tablet, 6 desktop
className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6"
```

#### 4. Flex Direction
```jsx
// Stack on mobile, row on desktop
className="flex flex-col lg:flex-row"

// Stack on mobile, row on tablet+
className="flex flex-col sm:flex-row"
```

#### 5. Visibility
```jsx
// Hide on mobile, show on tablet+
className="hidden sm:block"

// Hide on mobile, show on desktop
className="hidden lg:block"

// Show on mobile only
className="block sm:hidden"
```

#### 6. Widths & Heights
```jsx
// Full width mobile, fixed on larger screens
className="w-full sm:w-[380px]"

// Responsive heights
className="h-[50vh] sm:h-[60vh] lg:h-auto"

// Max widths
className="max-w-full sm:max-w-screen-sm lg:max-w-screen-lg"
```

#### 7. Icon Sizing
```jsx
// Responsive icon sizes
<Icon size={18} className="sm:w-[20px] sm:h-[20px] md:w-[22px] md:h-[22px]" />
```

#### 8. Touch Targets
```jsx
// Always use tap-target class for interactive elements
className="tap-target" // Ensures minimum 44px x 44px
```

### Component-Specific Patterns

#### Navigation Bar
```jsx
<nav className="px-4 sm:px-6 py-4 sm:py-5">
  <div className="flex items-center gap-3 sm:gap-4 md:gap-5">
    <button className="tap-target">
      <Menu size={20} className="sm:w-[22px] sm:h-[22px]" />
    </button>
  </div>
</nav>
```

#### Hero Section
```jsx
<section className="min-h-[calc(100vh-64px)] sm:min-h-[calc(100vh-72px)]">
  <div className="px-6 sm:px-8 md:px-12 lg:px-20 py-12 sm:py-16 md:py-20">
    <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-[6rem]">
      Title
    </h1>
  </div>
</section>
```

#### Product Grid
```jsx
<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 md:gap-10">
  {products.map(product => (
    <div key={product.id} className="group">
      <div className="h-64 sm:h-80 md:h-96">
        <img className="p-6 sm:p-8" />
      </div>
    </div>
  ))}
</div>
```

#### Modal/Drawer
```jsx
<div className="fixed top-0 right-0 h-full w-full sm:w-[90vw] md:w-[750px] lg:w-[900px]">
  <div className="px-6 sm:px-8 py-5 sm:py-6">
    {/* Content */}
  </div>
</div>
```

#### Buttons
```jsx
// Primary button
<button className="px-6 sm:px-8 py-3 sm:py-4 text-xs sm:text-sm tap-target">
  Click Me
</button>

// Icon button
<button className="w-10 h-10 sm:w-12 sm:h-12 tap-target">
  <Icon size={18} className="sm:w-[20px] sm:h-[20px]" />
</button>
```

### Testing Checklist

#### Mobile (< 640px)
- [ ] All text is readable (minimum 12px)
- [ ] All buttons are tappable (minimum 44px)
- [ ] No horizontal scroll
- [ ] Images load properly
- [ ] Navigation menu works
- [ ] Forms are usable
- [ ] Spacing is appropriate

#### Tablet (640px - 1023px)
- [ ] Layout adapts properly
- [ ] Grid columns adjust
- [ ] Text sizing increases
- [ ] Spacing increases
- [ ] Images scale appropriately
- [ ] Navigation shows more items

#### Desktop (1024px+)
- [ ] Full layout displays
- [ ] All features accessible
- [ ] Hover states work
- [ ] Optimal spacing
- [ ] Maximum content width respected

### Common Pitfalls to Avoid

1. **Fixed Widths**: Use responsive units instead
   ```jsx
   // ❌ Bad
   className="w-[400px]"
   
   // ✅ Good
   className="w-full sm:w-[400px]"
   ```

2. **Missing Touch Targets**: Always ensure 44px minimum
   ```jsx
   // ❌ Bad
   <button className="p-1">
   
   // ✅ Good
   <button className="p-2 tap-target">
   ```

3. **Inconsistent Spacing**: Use the same scale
   ```jsx
   // ❌ Bad
   className="px-3 sm:px-7 md:px-11"
   
   // ✅ Good
   className="px-4 sm:px-6 md:px-8"
   ```

4. **Forgetting Intermediate Breakpoints**: Don't jump from mobile to desktop
   ```jsx
   // ❌ Bad
   className="text-sm lg:text-2xl"
   
   // ✅ Good
   className="text-sm sm:text-base md:text-lg lg:text-xl"
   ```

5. **Not Testing on Real Devices**: Emulators aren't enough
   - Test on actual phones and tablets
   - Check different orientations
   - Test touch interactions

### Performance Tips

1. **Lazy Load Images**: Use loading="lazy" attribute
2. **Optimize Image Sizes**: Serve appropriate sizes for each breakpoint
3. **Minimize Layout Shifts**: Reserve space for images
4. **Use CSS Transforms**: Better performance than position changes
5. **Debounce Resize Events**: If using JavaScript for responsive behavior

### Accessibility Reminders

1. **Touch Targets**: Minimum 44px x 44px
2. **Text Contrast**: WCAG AA minimum (4.5:1)
3. **Focus Indicators**: Visible on all interactive elements
4. **Keyboard Navigation**: Works on all screen sizes
5. **Screen Reader Support**: Proper ARIA labels

### Useful Tailwind Classes

```
Spacing: p-4, px-6, py-8, gap-4, space-y-6
Sizing: w-full, h-screen, min-h-[50vh], max-w-7xl
Display: flex, grid, hidden, block
Position: fixed, sticky, absolute, relative
Typography: text-sm, font-light, tracking-wider
Colors: bg-gray-50, text-black, border-gray-200
Effects: hover:, focus:, group-hover:, transition-all
```

### Resources

- [Tailwind CSS Responsive Design](https://tailwindcss.com/docs/responsive-design)
- [MDN Responsive Design](https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Responsive_Design)
- [Web.dev Responsive Images](https://web.dev/responsive-images/)
- [WCAG Touch Target Guidelines](https://www.w3.org/WAI/WCAG21/Understanding/target-size.html)
