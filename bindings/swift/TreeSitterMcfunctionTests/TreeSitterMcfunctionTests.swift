import XCTest
import SwiftTreeSitter
import TreeSitterMcfunction

final class TreeSitterMcfunctionTests: XCTestCase {
    func testCanLoadGrammar() throws {
        let parser = Parser()
        let language = Language(language: tree_sitter_mcfunction())
        XCTAssertNoThrow(try parser.setLanguage(language),
                         "Error loading MCFunction grammar")
    }
}
