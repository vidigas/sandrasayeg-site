# Design Audit & Fix Plan - Projects Grid

## Screenshot Comparison Analysis

### Current Implementation Issues:
1. **No gaps between images** - images are touching edge-to-edge
2. **No side margins** - grid goes full viewport width
3. **No border-radius** - images have sharp corners
4. **Nav weight** - "projetos" should be visibly bolder

### PDF Design Requirements:
1. **Gaps between images**: ~20-25px white space between all thumbnails
2. **Side margins**: ~40px padding on left and right of grid
3. **Border-radius**: Subtle rounded corners (~4-6px) on thumbnails
4. **Bold active nav**: "projetos" clearly bolder than "contato"

## CSS Fixes Required

```css
/* Projects Grid - FIXES */
.projects-container {
    padding-top: 100px;
    padding-left: 40px;   /* ADD */
    padding-right: 40px;  /* ADD */
    padding-bottom: 40px; /* ADD */
}

.projects-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;  /* CHANGE from 0 to 20px */
}

.project-card {
    border-radius: 6px;   /* ADD */
    overflow: hidden;
}

.project-thumb {
    border-radius: 6px;   /* ADD */
}

/* Navigation - FIX */
.nav a.active {
    font-weight: 600;  /* CHANGE from 400 to 600 for more contrast */
}
```

## Implementation Order
1. Fix grid gap (from 0 to 20px)
2. Add container side padding (40px)
3. Add border-radius to cards (6px)
4. Increase active nav weight (600)
