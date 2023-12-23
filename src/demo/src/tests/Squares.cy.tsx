import Squares from "../examples/Squares";

const firstElemID = '[data-id="firstSquare"]';
const modalElemID = '[data-id="lastSquare"]';
const allowableDiff = 10;

describe("<Squares />", () => {
  it("has the correct dimensions before the open animation starts", () => {
    const onOpenAnimationStart = cy.spy().as("onOpenAnimationStart");
    cy.mount(
      <Squares pauseOnOpen={true} onOpenAnimationStart={onOpenAnimationStart} />
    );

    let firstElHeight: number, firstElWidth: number;

    cy.get(firstElemID).should("be.visible");

    cy.getDimensions(firstElemID).then(($el) => {
      firstElHeight = $el.elHeight;
      firstElWidth = $el.elWidth;
    });
    cy.get(firstElemID).click();

    cy.get(modalElemID).should("be.visible");

    cy.get("@onOpenAnimationStart").should("have.been.called");

    cy.getDimensions(modalElemID).then(($el) => {
      expect($el.elHeight).to.be.closeTo(
        firstElHeight - allowableDiff,
        firstElHeight + allowableDiff
      );
      expect($el.elWidth).to.be.closeTo(
        firstElWidth - allowableDiff,
        firstElWidth + allowableDiff
      );
    });
  });

  it("it performs an open animation", () => {
    const onOpenAnimationStart = cy.spy().as("onOpenAnimationStart");
    const onOpenAnimationEnd = cy.spy().as("onOpenAnimationEnd");

    cy.mount(
      <Squares
        onOpenAnimationStart={onOpenAnimationStart}
        onOpenAnimationEnd={onOpenAnimationEnd}
      />
    );

    cy.get(firstElemID).should("be.visible").click();

    cy.get("@onOpenAnimationStart").should("have.been.called");

    cy.get(modalElemID).should("be.visible");

    cy.get("@onOpenAnimationEnd").should("have.been.called");

    cy.get(modalElemID).should("be.visible");
  });

  it("has the correct dimensions before the close animation starts", () => {
    const onOpenAnimationEnd = cy.spy().as("onOpenAnimationEnd");
    const onCloseAnimationStart = cy.spy().as("onCloseAnimationStart");
    cy.mount(
      <Squares
        pauseOnClose={true}
        onOpenAnimationEnd={onOpenAnimationEnd}
        onCloseAnimationStart={onCloseAnimationStart}
      />
    );

    let modalElHeight: number, modalElWidth: number;

    cy.get(firstElemID).should("be.visible").click();

    cy.get("@onOpenAnimationEnd").should("have.been.called");

    cy.getDimensions(modalElemID).then(($el) => {
      modalElHeight = $el.elHeight;
      modalElWidth = $el.elWidth;
    });
    cy.get(modalElemID).click();

    cy.get("@onCloseAnimationStart").should("have.been.called");

    cy.getDimensions(firstElemID).then(($el) => {
      expect($el.elHeight).to.be.closeTo(
        modalElHeight - allowableDiff,
        modalElHeight + allowableDiff
      );
      expect($el.elWidth).to.be.closeTo(
        modalElWidth - allowableDiff,
        modalElWidth + allowableDiff
      );
    });
  });

  it("it performs an close animation", () => {
    const onCloseAnimationStart = cy.spy().as("onCloseAnimationStart");
    const onCloseAnimationEnd = cy.spy().as("onCloseAnimationEnd");

    cy.mount(
      <Squares
        onCloseAnimationStart={onCloseAnimationStart}
        onCloseAnimationEnd={onCloseAnimationEnd}
      />
    );

    cy.get(firstElemID).should("be.visible").click();

    cy.get(modalElemID).should("be.visible").click();

    cy.get("@onCloseAnimationStart").should("have.been.called");

    cy.get(firstElemID).should("be.visible");

    cy.get("@onCloseAnimationEnd").should("have.been.called");
  });
});
