// src/jsx-runtime.ts
// Triển khai JSX runtime đầy đủ từ Part 1, 2, và 3

// --- Part 1.2: Basic VNode Definitions ---

// TODO: Define the VNode interface
export interface VNode {
  type: string | ComponentFunction;
  props: Record<string, any>;
  children: (VNode | string | number)[];
}

// TODO: Define ComponentProps interface
export interface ComponentProps {
  children?: (VNode | string | number)[];
  [key: string]: any;
}

// TODO: Define ComponentFunction type
export type ComponentFunction = (props: ComponentProps) => VNode;

// TODO: Implement createElement function
export function createElement(
  type: string | ComponentFunction,
  props: Record<string, any> | null,
  ...children: (VNode | string | number)[]
): VNode {
  // STEP 1: Handle props
  const finalProps = props ? { ...props } : {};

  // STEP 2: Flatten and filter children
  const finalChildren = children.flat().filter(child => child !== null && child !== undefined);

  // Ensure children are available on props for component functions
  (finalProps as any).children = finalChildren;

  // STEP 3: Return VNode object
  return {
    type,
    props: finalProps,
    children: finalChildren,
  };
}

// TODO: Implement createFragment function
export function createFragment(
  props: Record<string, any> | null,
  ...children: (VNode | string | number)[]
): VNode {
  // Hint: Use createElement with 'fragment' as type
  return createElement('fragment', props, ...children);
}


// --- Part 1.3 & 3.1: DOM Rendering & State ---

// --- State & Hook Management ---
// Để làm cho Part 4 hoạt động, chúng ta cần một hệ thống state và effect
// có khả năng re-render.

let root: {
  vnode: VNode | null;
  container: HTMLElement | null;
} = {
  vnode: null,
  container: null,
};

function _render() {
  if (!root.container || !root.vnode) {
    return;
  }

  // Đặt lại hook index cho component gốc
  hookIndex = 0;
  
  const newDOM = renderToDOM(root.vnode);

  if (root.container.firstChild) {
    root.container.replaceChild(newDOM, root.container.firstChild);
  } else {
    root.container.appendChild(newDOM);
  }

  // After DOM updates, run any scheduled effects
  try {
    runPendingEffects();
  } catch (e) {
    // ignore
  }
}

let hooks: any[] = [];
let hookIndex = 0;
let pendingEffects: Array<{ index: number; callback: () => (void | (() => void)) }> = [];

// TODO: Implement basic state management
export function useState<T>(initialValue: T): [T, (newValue: T | ((prev: T) => T)) => void] {
  const currentIndex = hookIndex;
  
  // Khởi tạo state nếu đây là lần render đầu tiên
  if (hooks.length === currentIndex) {
    hooks.push(initialValue);
  }

  const value: T = hooks[currentIndex];
  
  const setValue = (newValue: T | ((prev: T) => T)) => {
    const a = typeof newValue === 'function' ? (newValue as (prev: T) => T)(hooks[currentIndex]) : newValue;

    if (a !== hooks[currentIndex]) {
      hooks[currentIndex] = a;
      // Trigger re-render
      _render();
    }
  };

  hookIndex++;
  return [value, setValue];
}

// Cần thiết cho Part 4 (Chart) để vẽ lên canvas
export function useEffect(callback: () => (() => void) | void, deps: any[]) {
  const currentIndex = hookIndex;
  const oldEntry = hooks[currentIndex] as any;
  const oldDeps = oldEntry && oldEntry.deps ? oldEntry.deps : undefined;
  let hasChanged = true;

  if (oldDeps) {
    hasChanged = deps.some((dep, i) => !Object.is(dep, oldDeps[i]));
  }

  if (hasChanged) {
    // Schedule the effect to run after the DOM is rendered
    pendingEffects.push({ index: currentIndex, callback });
    // Store deps and placeholder for cleanup
    hooks[currentIndex] = { deps, cleanup: undefined };
  }

  hookIndex++;
}


// TODO: Implement renderToDOM function
export function renderToDOM(vnode: VNode | string | number): Node {
  // STEP 1: Handle text nodes
  if (vnode === null || vnode === undefined) {
    return document.createTextNode('');
  }

  if (typeof vnode === 'string' || typeof vnode === 'number') {
    return document.createTextNode(String(vnode));
  }

  // STEP 2: Handle fragments
  if (vnode.type === 'fragment') {
    const fragment = document.createDocumentFragment();
    vnode.children.forEach(child => fragment.appendChild(renderToDOM(child)));
    return fragment;
  }

  // STEP 3: Handle component functions
  if (typeof vnode.type === 'function') {
    // Đặt lại hook index cho component này
    hookIndex = 0;
    const componentVNode = vnode.type(vnode.props || {});
    return renderToDOM(componentVNode as any);
  }

  // STEP 4: Handle regular HTML elements
  const element = document.createElement(vnode.type as string);

  // Set attributes and event listeners
  Object.keys(vnode.props).forEach(key => {
    const value = vnode.props[key];

    // TODO: Feature 1: Refs Support (Part 3.1)
    if (key === 'ref' && typeof value === 'function') {
      value(element);
    } 
    // Handle event listeners (e.g., onClick)
    else if (key.startsWith('on') && typeof value === 'function') {
      const eventType = key.substring(2).toLowerCase();
      element.addEventListener(eventType, value);
    }
    // TODO: Feature 2: CSS-in-JS Support (Part 3.1)
    else if (key === 'style' && typeof value === 'object') {
      // Handle object styles
      Object.keys(value).forEach(styleKey => {
        // Assign using the style property (camelCase) to the element.style object
        (element.style as any)[styleKey] = value[styleKey];
      });
    }
    // Handle string styles
    else if (key === 'style' && typeof value === 'string') {
      element.setAttribute('style', value);
    }
    // Handle className
    else if (key === 'className') {
      element.setAttribute('class', value);
    }
    // Handle htmlFor -> for
    else if (key === 'htmlFor') {
      element.setAttribute('for', value);
    }
    // Handle value and checked as properties
    else if (key === 'value') {
      try {
        (element as any).value = value;
      } catch (e) {
        element.setAttribute(key, value);
      }
    }
    else if (key === 'checked') {
      try {
        (element as any).checked = value;
      } catch (e) {
        if (value) element.setAttribute(key, ''); else element.removeAttribute(key);
      }
    }
    // Handle boolean attributes
    else if (typeof value === 'boolean') {
      if (value) element.setAttribute(key, ''); else element.removeAttribute(key);
    }
    // Handle other attributes
    else if (key !== 'children') {
      element.setAttribute(key, value);
    }
  });

  // Append children
  vnode.children.forEach(child => {
    element.appendChild(renderToDOM(child));
  });

  return element;
}

// TODO: Implement mount function
export function mount(vnode: VNode, container: HTMLElement): void {
  if (!container) {
    throw new Error('Container element not found');
  }
  
  root.vnode = vnode;
  root.container = container;
  
  container.innerHTML = ''; // Xóa nội dung cũ
  _render();
}

// Run pending effects after a render completes
function runPendingEffects() {
  if (!pendingEffects || pendingEffects.length === 0) return;

  pendingEffects.forEach(({ index, callback }) => {
    const entry = hooks[index];
    // Run previous cleanup if present
    if (entry && typeof entry.cleanup === 'function') {
      try {
        entry.cleanup();
      } catch (e) {
        // ignore
      }
    }

    const cleanup = callback();
    if (!hooks[index]) hooks[index] = {};
    hooks[index].cleanup = typeof cleanup === 'function' ? cleanup : undefined;
  });

  pendingEffects = [];
}