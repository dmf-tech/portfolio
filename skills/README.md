# Skills Content Management

This directory contains individual HTML files for each skill category in the Skills section of the portfolio. This modular approach makes it easy to edit and manage skills content independently.

## File Structure

```
skills/
├── README.md
├── frontend-skills.html
├── backend-skills.html
├── sysadmin-skills.html
├── devops-skills.html
└── ai-skills.html
```

## How It Works

- Each skill category has its own HTML file
- Content is loaded dynamically via JavaScript when tabs are clicked
- Files are loaded using the `fetch()` API
- Loading placeholders are shown while content is being loaded
- Error handling is included for failed content loads

## Editing Skills Content

### Adding New Skills
To add a new skill to any category:

1. Open the corresponding HTML file (e.g., `frontend-skills.html`)
2. Find the appropriate skill category section
3. Add a new `<span class="skill-tag">Your Skill</span>` element
4. Save the file

### Example: Adding a new Frontend skill
```html
<div class="skill-category">
    <h5><i class="fas fa-code"></i> Core Technologies</h5>
    <div class="skill-tags">
        <span class="skill-tag">HTML5</span>
        <span class="skill-tag">CSS3</span>
        <span class="skill-tag">JavaScript (ES6+)</span>
        <span class="skill-tag">TypeScript</span>
        <span class="skill-tag">Your New Skill</span> <!-- Add this line -->
    </div>
</div>
```

### Adding New Skill Categories
To add a new skill category within a tab:

1. Open the appropriate skills file
2. Add a new `<div class="skill-category">` section
3. Include an icon, title, and skill tags

### Example: Adding a new category
```html
<div class="skill-category">
    <h5><i class="fas fa-rocket"></i> New Category</h5>
    <div class="skill-tags">
        <span class="skill-tag">Skill 1</span>
        <span class="skill-tag">Skill 2</span>
        <span class="skill-tag">Skill 3</span>
    </div>
</div>
```

### Adding New Skill Tabs
To add a completely new skill tab:

1. Create a new HTML file in the `skills/` directory (e.g., `new-skills.html`)
2. Add the tab button to `index.html` in the skills section
3. Add the tab pane to `index.html`
4. Update the `skillsContentMap` in `js/script.js`

## File Format

Each skills file should follow this structure:

```html
<div class="skills-header">
    <h4 class="skills-title">
        <i class="fas fa-icon"></i>
        Skill Category Title
    </h4>
    <p>Description of the skill category.</p>
</div>

<div class="skills-categories">
    <div class="skill-category">
        <h5><i class="fas fa-sub-icon"></i> Subcategory Title</h5>
        <div class="skill-tags">
            <span class="skill-tag">Skill 1</span>
            <span class="skill-tag">Skill 2</span>
            <!-- Add more skills as needed -->
        </div>
    </div>
    <!-- Add more categories as needed -->
</div>
```

## Available Icons

You can use any Font Awesome icon. Common icons used:
- `fas fa-code` - Programming
- `fas fa-server` - Backend
- `fas fa-database` - Database
- `fas fa-cloud` - Cloud/DevOps
- `fas fa-brain` - AI/ML
- `fas fa-palette` - Frontend
- `fas fa-tools` - Tools
- `fas fa-mobile-alt` - Mobile
- `fas fa-chart-line` - Analytics
- `fas fa-shield-alt` - Security

## Benefits of This Approach

1. **Easy Maintenance**: Each skill category is in its own file
2. **Version Control**: Changes to skills are tracked separately
3. **Collaboration**: Multiple people can edit different skill files
4. **Performance**: Content is loaded only when needed
5. **Scalability**: Easy to add new skill categories or tabs

## Troubleshooting

If content fails to load:
1. Check that the file path in `js/script.js` is correct
2. Ensure the HTML file exists and is properly formatted
3. Check browser console for error messages
4. Verify that the server is running and files are accessible

## Notes

- All files should be saved with UTF-8 encoding
- Use semantic HTML structure
- Maintain consistent formatting across all files
- Test changes in a local development environment before deploying 