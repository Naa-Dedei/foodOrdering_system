[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/XTiS23o6)
[![Open in Visual Studio Code](https://classroom.github.com/assets/open-in-vscode-2e0aaae1b6195c2367325f4f02e2d04e9abb55f0b24a779b69b11b9e10269abc.svg)](https://classroom.github.com/online_ide?assignment_repo_id=21039284&assignment_repo_type=AssignmentRepo)
# W02-Styling-the-Web: Responsive ### Step 2: Create Your Feature Branch
1. In VS Code:
   - [ ] Project Description

You'll be creating a fictional café website called **Café Bliss**. Your single-page responsive website should include:

| Section | Description | Status |
|---------|-------------|---------|
| Header | - Café name/logo<br>- Navigation menu (Home, Menu, Order, Contact)<br>- Flexbox alignment | [ ] |
| Hero Section | - Welcoming banner with background image<br>- Café slogan<br>- "View Menu" call-to-action button | [ ] |
| Menu Section | - 3–6 menu items in Flexbox grid<br>- Each item: image, name, price, description<br>- Responsive layout | [ ] |
| Order Form | - Semantic form with accessible labels<br>- Fields: item selection, quantity, name, email<br>- Proper validation | [ ] |
| Footer | - Contact information<br>- Social media links<br>- Copyright notice | [ ] |current branch name in the bottom-left corner (shows `main`)
   - [ ] Click **Create new branch**
   - [ ] Type `feature-cafe-page`
   - [ ] Press Enter to create and switch to the new branch

### Step 3: Verify Your Branch
- [ ] Check the bottom-left corner of VS Code - it should show `feature-cafe-page`
- [ ] You'll see your branch name in the Source Control panel Page (HTML5 + CSS + Flexbox)

## Objective
In this assignment, you will design a **responsive café webpage** that displays a menu and allows customers to place a simple order through an accessible form.  
You will apply **semantic HTML5**, **CSS styling**, and **Flexbox** to build a clean, accessible, and well-structured layout.

## Learning Outcomes
By completing this assignment, you should be able to:

- [ ] Structure a webpage using **semantic HTML5 elements**
- [ ] Use **CSS and Flexbox** to design responsive page layouts
- [ ] Style and organize **forms** for accessibility and usability
- [ ] Follow proper **Git branching and workflow** practices using **VS Code** and **GitHub**

## Getting Started: Setup in VS Code

### Before You Begin Checklist
- [ ] Accepted GitHub Classroom invitation
- [ ] Installed VS Code
- [ ] Installed Git
- [ ] Signed into GitHub in VS Code

### Step 1: Clone Repository in VS Code
1. Copy your **GitHub Classroom repository URL** from the assignment page
   > Example: `https://github.com/acity-webtech/W02-Styling-the-Web-yourname`

2. In VS Code:
   - [ ] Click on the **Source Control** icon in the left sidebar (branch icon)
   - [ ] Click on the **Clone Repository** button
   - [ ] Paste your GitHub Classroom repository URL
   - [ ] Choose a folder on your computer to save the project
   - [ ] Click **Open** when VS Code prompts to open the cloned project

 
and select **Git: Clone**.
4. Paste your repository URL and choose a folder on your computer to save it.
5. When cloning finishes, click **Open** to open the project in VS Code.

### Step 3: Create and Switch to a Feature Branch
1. In VS Code, open the **Source Control** panel (the branch icon on the left sidebar).
2. Click on the **current branch name** (usually `main`) in the bottom-left corner.
3. Select **Create new branch**.
4. Name your branch:
feature-cafe-page

 
5. VS Code will automatically switch you to this new branch.

### Step 4: Confirm You’re on the Correct Branch
Check the bottom-left corner of VS Code — it should display `feature-cafe-page`.  
Alternatively, open the terminal and run:
```bash
git branch
### Step 4: Project Structure
Create the following files and folders:

```
W02-Styling-the-Web/
│
├── index.html
├── css/
│   └── style.css
├── images/
│   └── (add your images)
└── README.md
```

### Step 5: Working with Source Control in VS Code
- [ ] Make your changes to the files
- [ ] Click the Source Control icon in the sidebar
- [ ] Review your changes
- [ ] Type a meaningful commit message (e.g., "Add menu section layout")
- [ ] Click the checkmark (✓) to commit
- [ ] Click "Sync Changes" to push to GitHub

### Step 6: Create Pull Request
1. In VS Code:
   - [ ] Click on the Source Control icon
   - [ ] Click on the three dots (...) menu
   - [ ] Select "Create Pull Request"

2. Pull Request Details:
   - [ ] Title format: `W02-Styling-the-Web: [Your Name] - [Student ID]`
   - [ ] Ensure source is `feature-cafe-page` and target is `main`
   - [ ] Click "Create"
Click Create Pull Request.

Submit your pull request link on the course portal.

2. Project Description
You are designing a fictional café website called Café Bliss.

Your task is to build a single-page responsive website that includes the following sections:

Section	Description
Header	Contains the café name/logo and a navigation menu (Home, Menu, Order, Contact). Use Flexbox for alignment.
Hero Section	A welcoming banner with a background image, café slogan, and a call-to-action button (“View Menu”).
Menu Section	Display 3–6 menu items (e.g., coffee, smoothies, pastries) in a Flexbox grid. Each item should include an image, name, price, and short description.
Order Form	A semantic form where customers can select items, input quantity, and provide their name/email. Include accessible labels.
Footer	Include contact info and social links.

## Sample Code

### index.html
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Café Bliss</title>
  <link rel="stylesheet" href="css/style.css">
</head>
<body>
  <header>
    <h1>Café Bliss</h1>
    <nav>
      <ul>
        <li><a href="#menu">Menu</a></li>
        <li><a href="#order">Order</a></li>
        <li><a href="#contact">Contact</a></li>
      </ul>
    </nav>
  </header>

  <section class="hero">
    <h2>Freshly Brewed Happiness</h2>
    <p>Discover the perfect blend of flavor and warmth.</p>
    <button>View Menu</button>
  </section>

  <section id="menu">
    <h2>Our Menu</h2>
    <div class="menu-container">
      <article class="menu-item">
        <img src="images/coffee.jpg" alt="Cappuccino">
        <h3>Cappuccino</h3>
        <p>$3.50</p>
        <p>Rich espresso with steamed milk and foam.</p>
      </article>

      <article class="menu-item">
        <img src="images/pastry.jpg" alt="Croissant">
        <h3>Butter Croissant</h3>
        <p>$2.00</p>
        <p>Flaky and buttery, baked fresh daily.</p>
      </article>
    </div>
  </section>

  <section id="order">
    <h2>Place Your Order</h2>
    <form>
      <label for="name">Full Name:</label>
      <input type="text" id="name" name="name" required>

      <label for="email">Email Address:</label>
      <input type="email" id="email" name="email" required>

      <label for="item">Select Item:</label>
      <select id="item" name="item" required>
        <option value="">--Choose an item--</option>
        <option value="coffee">Cappuccino</option>
        <option value="croissant">Croissant</option>
      </select>

      <label for="quantity">Quantity:</label>
      <input type="number" id="quantity" name="quantity" min="1" required>

      <button type="submit">Submit Order</button>
    </form>
  </section>

  <footer id="contact">
    <p>© 2025 Café Bliss | Follow us @CafeBliss</p>
  </footer>
</body>
</html>
```

### style.css
```css
body {
  font-family: 'Poppins', sans-serif;
  margin: 0;
  padding: 0;
  color: #333;
  background: #fff;
}

header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background: #5c3d2e;
  color: white;
}

nav ul {
  list-style: none;
  display: flex;
  gap: 1rem;
}

nav a {
  color: white;
  text-decoration: none;
  font-weight: bold;
}

.hero {
  text-align: center;
  padding: 4rem 2rem;
  background: url('../images/coffee.jpg') center/cover no-repeat;
  color: white;
}

.menu-container {
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
  justify-content: center;
  padding: 2rem;
}

.menu-item {
  background: #f9f9f9;
  border-radius: 8px;
  width: 250px;
  text-align: center;
  box-shadow: 0 2px 6px rgba(0,0,0,0.1);
  padding: 1rem;
}

form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 300px;
  margin: 2rem auto;
}

button {
  background: #5c3d2e;
  color: white;
  border: none;
  padding: 0.7rem;
  cursor: pointer;
  border-radius: 4px;
}

footer {
  text-align: center;
  background: #f1f1f1;
  padding: 1rem;
  margin-top: 2rem;
}
```

## Final Submission Checklist

### Required Tasks
- [ ] Completed all sections (Header, Hero, Menu, Order Form, Footer)
- [ ] Implemented responsive design with Flexbox
- [ ] Used semantic HTML5 elements
- [ ] Added proper form validation
- [ ] Included all required images
- [ ] Tested on different screen sizes

### Code Quality
- [ ] HTML is properly formatted and valid
- [ ] CSS is organized and efficient
- [ ] All links work correctly
- [ ] Images have alt text
- [ ] Forms have proper labels

### Version Control
- [ ] All changes committed
- [ ] Commits have clear messages
- [ ] Branch is up to date
- [ ] Pull request created correctly
- [ ] Pull request title follows format: `W02-Styling-the-Web: [Your Name] - [Student ID]`

## Bonus Challenges (Optional)
- [ ] Add media queries for mobile responsiveness
- [ ] Implement hover effects on buttons and menu cards
- [ ] Integrate Google Fonts
- [ ] Add Font Awesome icons
- [ ] Create a dark mode toggle
- [ ] Add smooth scroll behavior
- [ ] Implement form validation feedback
