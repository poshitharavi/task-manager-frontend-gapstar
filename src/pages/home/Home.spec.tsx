import "@testing-library/jest-dom";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Home from "./Home";
import { useTaskStore } from "../../store/taskStore";

// Mock external dependencies
jest.mock("react-icons/fi", () => ({
  FiEye: () => <div>EyeIcon</div>,
  FiEdit: () => <div>EditIcon</div>,
  FiTrash: () => <div>TrashIcon</div>,
  FiPlus: () => <div>PlusIcon</div>,
}));

jest.mock("../../components/ui/Navbar", () => () => <div>Navbar</div>);
jest.mock(
  "../../components/ui/BodyCard",
  () =>
    ({ children }: { children: React.ReactNode }) =>
      <div>{children}</div>
);
jest.mock("../../components/Home/CreateTaskModal", () => () => (
  <div>CreateTaskModal</div>
));
jest.mock("../../components/Home/ViewTaskModal", () => () => (
  <div>ViewTaskModal</div>
));
jest.mock("../../components/Home/EditTaskModal", () => () => (
  <div>EditTaskModal</div>
));
jest.mock("../../components/Home/DeleteConfirmationModal", () => () => (
  <div>DeleteConfirmationModal</div>
));

// Mock Zustand stores
jest.mock("../../store/taskStore", () => ({
  useTaskStore: jest.fn(),
}));

jest.mock("../../store/alertStore", () => ({
  useAlertStore: jest.fn(() => ({ showAlert: jest.fn() })),
}));

const mockUseTaskStore = useTaskStore as jest.MockedFunction<
  typeof useTaskStore
>;

beforeEach(() => {
  mockUseTaskStore.mockReturnValue({
    tasks: [
      {
        id: 1,
        title: "Test Task",
        description: "Test Description",
        priority: "HIGH",
        dueDate: "2024-01-01",
        status: "NOT_DONE",
      },
    ],
    counts: { active: 1, completed: 0 },
    sortBy: "id",
    isLoading: false,
    error: null,
    searchTerm: "",
    fetchTasks: jest.fn(),
    setSort: jest.fn(),
    updateStatus: jest.fn(),
    setSearchTerm: jest.fn(),
  });
});

afterEach(() => {
  jest.clearAllMocks();
  jest.useRealTimers();
});

describe("Home Component", () => {
  test("renders basic structure", () => {
    render(<Home />);

    expect(screen.getByText("Navbar")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Search tasks...")).toBeInTheDocument();
    expect(screen.getByText("1 active tasks, 0 completed")).toBeInTheDocument();
    expect(screen.getByRole("combobox")).toBeInTheDocument();
  });

  test("handles search input with debounce", async () => {
    jest.useFakeTimers();
    const mockSetSearch = jest.fn();

    mockUseTaskStore.mockReturnValue({
      ...mockUseTaskStore(),
      setSearchTerm: mockSetSearch,
    });

    render(<Home />);

    const searchInput = screen.getByPlaceholderText("Search tasks...");
    fireEvent.change(searchInput, { target: { value: "test" } });

    jest.runAllTimers();

    await waitFor(() => {
      expect(mockSetSearch).toHaveBeenCalledWith("test");
    });
  });

  test("handles sort change", () => {
    const mockSetSort = jest.fn();

    mockUseTaskStore.mockReturnValue({
      ...mockUseTaskStore(),
      setSort: mockSetSort,
    });

    render(<Home />);

    const sortSelect = screen.getByRole("combobox");
    fireEvent.change(sortSelect, { target: { value: "priority" } });

    expect(mockSetSort).toHaveBeenCalledWith("priority");
  });

  test("opens create task modal", () => {
    render(<Home />);

    fireEvent.click(screen.getByTitle("Create New Task"));
    expect(screen.getByText("CreateTaskModal")).toBeInTheDocument();
  });

  test("displays task data correctly", () => {
    render(<Home />);

    expect(screen.getByText("Test Task")).toBeInTheDocument();
    expect(screen.getByText("HIGH")).toBeInTheDocument();
    expect(screen.getByText("Jan 01, 2024")).toBeInTheDocument();
    expect(screen.getByText("NOT DONE")).toBeInTheDocument();
  });

  test("handles task status toggle", () => {
    const mockUpdateStatus = jest.fn();

    mockUseTaskStore.mockReturnValue({
      ...mockUseTaskStore(),
      updateStatus: mockUpdateStatus,
    });

    render(<Home />);

    const statusButton = screen.getByText("NOT DONE");
    fireEvent.click(statusButton);

    expect(mockUpdateStatus).toHaveBeenCalledWith(1, "DONE");
  });

  test("shows loading state", () => {
    mockUseTaskStore.mockReturnValue({
      ...mockUseTaskStore(),
      isLoading: true,
    });

    render(<Home />);

    expect(screen.getByText("Loading tasks...")).toBeInTheDocument();
  });

  test("shows error state", () => {
    mockUseTaskStore.mockReturnValue({
      ...mockUseTaskStore(),
      error: "Failed to load tasks",
    });

    render(<Home />);

    expect(screen.getByText("Failed to load tasks")).toBeInTheDocument();
  });

  test("opens view/edit/delete modals", () => {
    render(<Home />);

    // Test View
    fireEvent.click(screen.getAllByTitle("View")[0]);
    expect(screen.getByText("ViewTaskModal")).toBeInTheDocument();

    // Test Edit
    fireEvent.click(screen.getAllByTitle("Edit")[0]);
    expect(screen.getByText("EditTaskModal")).toBeInTheDocument();

    // Test Delete
    fireEvent.click(screen.getAllByTitle("Delete")[0]);
    expect(screen.getByText("DeleteConfirmationModal")).toBeInTheDocument();
  });

  test("displays correct priority colors", () => {
    render(<Home />);

    const highPriority = screen.getByText("HIGH");
    expect(highPriority).toHaveClass("bg-red-500");
  });

  test("displays correct task counts", () => {
    mockUseTaskStore.mockReturnValue({
      ...mockUseTaskStore(),
      counts: { active: 3, completed: 2 },
    });

    render(<Home />);

    expect(screen.getByText("3 active tasks, 2 completed")).toBeInTheDocument();
  });
});
