// src/jsx.d.ts

// Định nghĩa namespace JSX toàn cục
declare namespace JSX {
  /**
   * Định nghĩa 'IntrinsicElements' để TypeScript
   * nhận diện các thẻ HTML tiêu chuẩn (div, canvas, button, v.v.).
   * Chúng ta sử dụng một "index signature" [elemName: string]: any;
   * để cho phép BẤT KỲ thẻ HTML nào với BẤT KỲ thuộc tính nào.
   * Điều này phù hợp với custom runtime của chúng ta.
   */
  interface IntrinsicElements {
    [elemName: string]: any;
  }
}