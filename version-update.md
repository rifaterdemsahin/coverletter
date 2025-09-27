# Version Update Guide

## Quick Version Update Commands

### For Patch Updates (Bug Fixes)
```bash
# Update package.json
npm version patch

# Update index.html version badge and date
# Manually update the version number and date in index.html

# Update cursor.md version history
# Add new version entry to cursor.md
```

### For Minor Updates (New Features)
```bash
# Update package.json
npm version minor

# Update index.html version badge and date
# Manually update the version number and date in index.html

# Update cursor.md version history
# Add new version entry to cursor.md
```

### For Major Updates (Breaking Changes)
```bash
# Update package.json
npm version major

# Update index.html version badge and date
# Manually update the version number and date in index.html

# Update cursor.md version history
# Add new version entry to cursor.md
```

## Version Update Checklist

### 1. Update package.json
- [ ] Run appropriate npm version command
- [ ] Verify version number is correct

### 2. Update index.html
- [ ] Update version badge text (e.g., "v1.0.1")
- [ ] Update build date (e.g., "Build 2025-01-28")
- [ ] Verify styling looks correct

### 3. Update cursor.md
- [ ] Add new version entry to Version History section
- [ ] Include build date and feature list
- [ ] Update technical details if changed

### 4. Commit and Push
- [ ] Commit all changes with descriptive message
- [ ] Push to repository
- [ ] Tag the release if it's a major version

## Version Display Locations

1. **package.json** - `"version": "1.0.0"`
2. **index.html** - Version badge in header
3. **cursor.md** - Version history section

## Example Version Update

### Before (v1.0.0):
```html
<div class="version-info">
    <span class="version-badge">v1.0.0</span>
    <span class="version-date">Build 2025-01-27</span>
</div>
```

### After (v1.0.1):
```html
<div class="version-info">
    <span class="version-badge">v1.0.1</span>
    <span class="version-date">Build 2025-01-28</span>
</div>
```

## Automated Version Update Script

Create a script to automate version updates:

```bash
#!/bin/bash
# update-version.sh

# Get current date
BUILD_DATE=$(date +%Y-%m-%d)

# Update package.json version
npm version patch

# Get new version number
NEW_VERSION=$(node -p "require('./package.json').version")

# Update index.html
sed -i "s/v[0-9]\+\.[0-9]\+\.[0-9]\+/v${NEW_VERSION}/g" index.html
sed -i "s/Build [0-9]\{4\}-[0-9]\{2\}-[0-9]\{2\}/Build ${BUILD_DATE}/g" index.html

echo "Version updated to v${NEW_VERSION} (${BUILD_DATE})"
```

## Version History Template

When adding a new version to cursor.md, use this template:

```markdown
### Version X.Y.Z (YYYY-MM-DD) - [Release Type]
- **Build**: YYYY-MM-DD
- **Features**: 
  - [List new features]
  - [List improvements]
  - [List bug fixes]
- **Technical**: 
  - [List technical changes]
  - [List dependency updates]
  - [List configuration changes]
```

## Best Practices

1. **Always update all three locations** (package.json, index.html, cursor.md)
2. **Use descriptive commit messages** with version number
3. **Test the application** after version updates
4. **Update documentation** if new features are added
5. **Tag releases** for major versions
6. **Keep version history** detailed and organized
