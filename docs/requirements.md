# Wine Cellar Management — Requirements

## Introduction

This document defines the requirements for a simple wine cellar inventory management web application. The app enables a single user to catalog, browse, edit, and remove wines from their personal collection. It is built on the MERN stack (MongoDB, Express, React, Node.js) and provides a modern, responsive UI.

---

## 1. Wine Inventory Management

### 1.1 Add a Wine

**User Story:** As a cellar owner, I want to add a wine to my collection, so that I can keep track of what I have.

**Acceptance Criteria:**

1. When the user submits the "Add Wine" form, the system shall create a new wine entry with the following fields:
   - Name (required, max 200 characters)
   - Producer (required, max 200 characters)
   - Vintage (optional, 4-digit year between 1900 and current year + 1)
   - Type (required, one of: Red, White, Rosé, Sparkling, Dessert, Fortified)
   - Grape variety (optional, max 200 characters)
   - Region (optional, max 200 characters)
   - Country (optional, max 100 characters)
   - Quantity (required, integer ≥ 0, default 1)
   - Price (optional, number ≥ 0, in user's currency)
   - Rating (optional, integer 1–5)
   - Notes (optional, max 2000 characters)
   - Status (required, one of: In Cellar, Consumed, Wishlist, default "In Cellar")
2. When the form is submitted with invalid data, the system shall display clear validation error messages without losing the user's input.
3. When a wine is successfully created, the system shall display it in the wine list immediately.

### 1.2 Browse Wines

**User Story:** As a cellar owner, I want to browse my wine collection, so that I can see what's in my cellar at a glance.

**Acceptance Criteria:**

1. When the user opens the dashboard, the system shall display all wines sorted by creation date (newest first).
2. The system shall display each wine's name, producer, vintage, type, quantity, rating, and status in a card or list view.
3. When there are no wines in the collection, the system shall display an empty state message with a prompt to add the first wine.

### 1.3 Filter and Search Wines

**User Story:** As a cellar owner, I want to filter and search my wines, so that I can quickly find specific bottles.

**Acceptance Criteria:**

1. When the user selects a type filter (Red, White, Rosé, Sparkling, Dessert, Fortified), the system shall display only wines matching that type.
2. When the user selects a status filter (In Cellar, Consumed, Wishlist), the system shall display only wines matching that status.
3. When the user enters text in the search field, the system shall filter wines whose name or producer contains the search text (case-insensitive).
4. When multiple filters are active simultaneously, the system shall apply all filters (AND logic).
5. When the user clears all filters, the system shall display the full wine list.

### 1.6 Region Map

**User Story:** As a cellar owner, I want to see a map of French wine regions highlighting where my wines come from, so that I can visually browse my collection by geography.

**Acceptance Criteria:**

1. The system shall display an interactive SVG map of France showing major wine regions (Bordeaux, Bourgogne, Champagne, Alsace, Loire, Vallée du Rhône, Beaujolais, Languedoc, Roussillon, Provence, Sud-Ouest, Jura, Savoie, Corse).
2. When wines in the cellar have a region matching a major region or one of its sub-regions/appellations, the system shall highlight that region on the map with a distinct color.
3. When the user clicks on a highlighted region, the system shall filter the wine list to display only wines from that region and its sub-regions.
4. When the user clicks the same region again (or a clear button), the system shall remove the region filter.
5. The system shall use a predefined mapping of sub-regions to parent regions (e.g., "Haut-Médoc" → Bordeaux, "Chablis" → Bourgogne) for matching.
6. The region filter shall work in combination with existing type, status, and search filters (AND logic).
7. The map shall display a legend indicating the meaning of highlighted vs. non-highlighted regions.

### 1.7 Internationalization

**User Story:** As a cellar owner, I want the application to be available in English and French, so that I can use it in my preferred language.

**Acceptance Criteria:**

1. The system shall support two languages: English (en) and French (fr).
2. The system shall display a language switcher in the application header allowing the user to toggle between languages.
3. When the user switches language, all user-facing text (labels, buttons, placeholders, validation messages, empty states) shall update immediately without page reload.
4. The system shall persist the selected language in localStorage so it is remembered across sessions.
5. When no language is stored, the system shall auto-detect the browser's preferred language and default to it if supported, otherwise default to English.
6. When the language changes, the browser tab title shall update to reflect the current language ("Wine Cellar" in English, "Cave à Vins" in French).
7. The `<html>` element's `lang` attribute shall update to match the selected locale.

### 1.4 Edit a Wine

**User Story:** As a cellar owner, I want to edit a wine's details, so that I can update quantity, notes, or fix errors.

**Acceptance Criteria:**

1. When the user clicks "Edit" on a wine, the system shall open a form pre-populated with the wine's current data.
2. When the user submits the edit form with valid data, the system shall update the wine and reflect the changes immediately.
3. When the user submits the edit form with invalid data, the system shall display validation errors without losing changes.
4. When the user cancels editing, the system shall discard changes and close the form.

### 1.5 Delete a Wine

**User Story:** As a cellar owner, I want to delete a wine from my collection, so that I can remove entries I no longer need.

**Acceptance Criteria:**

1. When the user clicks "Delete" on a wine, the system shall display a confirmation dialog.
2. When the user confirms deletion, the system shall remove the wine and update the list immediately.
3. When the user cancels deletion, the system shall keep the wine unchanged.

---

## 2. Dashboard Statistics

### 2.1 Collection Overview

**User Story:** As a cellar owner, I want to see summary statistics of my cellar, so that I can understand my collection at a glance.

**Acceptance Criteria:**

1. The system shall display the total number of bottles (sum of all quantities where status is "In Cellar").
2. The system shall display the estimated total cellar value (sum of quantity × price for wines with status "In Cellar" and a price set).
3. The system shall display a breakdown by wine type (count of bottles per type for "In Cellar" wines).
4. The statistics shall update immediately when wines are added, edited, or deleted.

---

## 3. API

### 3.1 RESTful Wine Endpoints

**User Story:** As a frontend application, I want a RESTful API for wines, so that I can perform CRUD operations.

**Acceptance Criteria:**

1. The API shall provide `GET /wines` that returns all wines, supporting optional query parameters: `type`, `status`, and `search`.
2. The API shall provide `GET /wines/:id` that returns a single wine by ID, or 404 if not found.
3. The API shall provide `POST /wines` that creates a wine with validated input, returning 201 on success or 400 with validation errors.
4. The API shall provide `PUT /wines/:id` that updates a wine by ID with validated input, returning 200 on success, 400 on validation error, or 404 if not found.
5. The API shall provide `DELETE /wines/:id` that deletes a wine by ID, returning 200 on success or 404 if not found.
6. All API responses shall follow the format: `{ success: boolean, data?: any, error?: string }`.

---

## 4. Non-Functional Requirements

### 4.1 Usability

1. The interface shall be responsive and usable on screens from 375px to 1920px wide.
2. The interface shall use accessible form controls with proper labels and ARIA attributes.
3. The interface shall provide visual feedback during loading and error states.

### 4.2 Performance

1. The API shall respond within 500ms for typical operations (< 1000 wines).
2. The frontend shall show a loading indicator while fetching data.

### 4.3 Data Validation

1. All user input shall be validated on both client and server side.
2. The server shall never trust client-side validation alone.
